# Windows Security Cheat Sheet

> Defensive/DFIR companion to Linux-Security-Cheat-Sheet.md. Commands are for **hardening, detection, and analysis of your own systems or authorized investigations** (your lab, TryHackMe/HTB boxes, systems you are cleared to defend). PowerShell-first; run elevated ("Run as administrator") where noted. During a live incident, follow the order of volatility in Incident-Response-Playbook.md — read before you change.

---

## 1) Accounts & Sessions

### Local accounts and groups

```powershell
Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordLastSet   # all local accounts — dormant or unexpected ones stand out
Get-LocalUser <name> | Format-List *                                      # full detail on one account (created date, SID, description)
Get-LocalGroupMember Administrators                                       # who is local admin — every entry needs a justification
net user                                                                  # classic view of local accounts (works everywhere, incl. old hosts)
net user <name>                                                           # account detail: last logon, group memberships, script path
net localgroup administrators                                             # classic admin-group listing — cross-check with the PS output
whoami /all                                                               # current identity: SID, groups, privileges (SeDebugPrivilege etc.)
```

### Who is logged on right now

```powershell
query user                                # interactive sessions: user, session, idle time, logon time (alias: quser)
query session                             # all sessions incl. RDP listeners and disconnected sessions (alias: qwinsta)
klist sessions                            # all LSA logon sessions on the host — unexpected extra sessions can mean credential reuse
```

### Logon history — Get-WinEvent with FilterHashtable

Security log requires an elevated shell. Property indexes below are stable for 4624/4625 on modern Windows.

```powershell
# Failed logons (4625), last 24h: who, from where, what logon type
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddHours(-24)} |
  Select-Object TimeCreated,
    @{n='Account';  e={$_.Properties[5].Value}},
    @{n='LogonType';e={$_.Properties[10].Value}},
    @{n='SourceIP'; e={$_.Properties[19].Value}}

# Brute force / spray check: failed logons grouped by account
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddHours(-24)} |
  Group-Object {$_.Properties[5].Value} | Sort-Object Count -Descending | Select-Object Count, Name -First 15

# Successful logons (4624), last 24h — filter out noise types, keep interactive(2)/network(3)/RDP(10)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624; StartTime=(Get-Date).AddHours(-24)} |
  Where-Object {$_.Properties[8].Value -in 2,3,10} |
  Select-Object TimeCreated,
    @{n='Account';  e={$_.Properties[5].Value}},
    @{n='LogonType';e={$_.Properties[8].Value}},
    @{n='SourceIP'; e={$_.Properties[18].Value}}

# The events that should almost never appear: log cleared (1102), account created (4720)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102,4720; StartTime=(Get-Date).AddDays(-7)} |
  Format-List TimeCreated, Id, Message
```

Logon types worth memorizing: `2` console, `3` network (SMB/shares), `4` batch (scheduled task), `5` service, `10` RDP.

---

## 2) Processes

```powershell
Get-Process | Select-Object Id, ProcessName, Path | Sort-Object Path      # every process WITH its binary path — system names running from odd paths jump out
Get-Process | Where-Object { $_.Path -and $_.Path -notmatch '^C:\\(Windows|Program Files)' } |
  Select-Object Id, ProcessName, Path                                     # processes outside Windows/Program Files — AppData/Temp binaries deserve a look
Get-CimInstance Win32_Process |
  Select-Object ProcessId, ParentProcessId, Name, CommandLine |
  Sort-Object ParentProcessId | Format-Table -Wrap                        # full command lines + parent PIDs — reconstruct the process tree by hand
Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" |
  Select-Object ProcessId, CommandLine                                    # every running PowerShell and exactly what it was launched with (-enc = look closer)
tasklist /svc                                                             # which services live inside which svchost.exe — fake "svchost" hosts nothing
Get-Process -Id <pid> | Select-Object -ExpandProperty Modules | Select-Object -First 20  # DLLs loaded by one process — odd-path modules
```

**Sysinternals** (free, from Microsoft — `https://live.sysinternals.com`): **Process Explorer** (`procexp64`) is the process tree GUI with signature verification and a built-in VirusTotal column — use it instead of Task Manager for triage. **Autoruns** (`autorunsc64 -accepteula -a * -s -m`) enumerates *every* autostart location at once and hides signed Microsoft entries — the fastest persistence sweep on the platform. **TCPView** live-maps sockets to processes; **sigcheck** verifies signatures and hashes single files.

---

## 3) Persistence Hunting

Where attackers wire themselves back in. This is a **hunting** list: enumerate each location, explain every entry, treat "I don't recognize it" as a lead to run down — not proof of evil. Compare against a clean baseline where you have one. Autoruns (above) covers all of these in one pass; the commands let you check any single location precisely.

### Registry run keys

```powershell
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run'          # machine-wide autostarts — runs for every user at logon
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce'      # one-shot autostarts — installers use it, so do droppers
Get-ItemProperty 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run'          # current-user autostarts — persistence without admin rights
Get-ItemProperty 'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run'  # 32-bit view — hiding spot people forget to check
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon' |
  Select-Object Shell, Userinit                                                 # must be explorer.exe / userinit.exe — anything appended is persistence
```

### Scheduled tasks

```powershell
Get-ScheduledTask | Where-Object State -ne Disabled |
  Select-Object TaskName, TaskPath, State                                       # all active tasks — unfamiliar names outside \Microsoft\ first
Get-ScheduledTask | ForEach-Object {
  $a = $_.Actions.Execute -join ' '
  if ($a -match 'Temp|AppData|Public|powershell|cmd|wscript|mshta|rundll32') {
    [pscustomobject]@{Task=$_.TaskPath+$_.TaskName; Action=$a; Args=$_.Actions.Arguments -join ' '} } } |
  Format-Table -Wrap                                                            # tasks executing from user-writable paths or via LOLBins — prime suspects
schtasks /query /fo LIST /v | Select-String -Context 2 'Task To Run'            # classic full dump incl. author and run-as — good for evidence capture
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4698; StartTime=(Get-Date).AddDays(-7)} |
  Format-List TimeCreated, Message                                              # tasks CREATED recently — the when and by whom
```

### Services

```powershell
Get-CimInstance Win32_Service |
  Select-Object Name, State, StartMode, StartName, PathName | Sort-Object Name  # all services with binary path and run-as account
Get-CimInstance Win32_Service |
  Where-Object { $_.PathName -notmatch '^"?C:\\(Windows|Program Files)' } |
  Select-Object Name, PathName, StartName                                       # services running from unusual paths — top hunting cut
Get-WinEvent -FilterHashtable @{LogName='System'; Id=7045; StartTime=(Get-Date).AddDays(-7)} |
  Format-List TimeCreated, Message                                              # services INSTALLED recently (7045) — remote-exec tools land here too
```

### WMI event subscriptions (fileless persistence classic)

```powershell
Get-CimInstance -Namespace root\subscription -ClassName __EventFilter           # trigger conditions — on a clean workstation this is near-empty
Get-CimInstance -Namespace root\subscription -ClassName CommandLineEventConsumer  # what gets EXECUTED when a filter fires — read every one
Get-CimInstance -Namespace root\subscription -ClassName __FilterToConsumerBinding # filter→consumer wiring — a binding completes the persistence
```

### Startup folders

```powershell
Get-ChildItem "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup" -Force            # current user's startup items
Get-ChildItem "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Startup" -Force        # all-users startup items
Get-ChildItem "C:\Users\*\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" -Force -ErrorAction SilentlyContinue  # every profile at once (admin)
```

Also on the full sweep (Autoruns shows all of these): Image File Execution Options `Debugger` values, `AppInit_DLLs`, browser extensions, Office add-ins, PowerShell profiles (`$PROFILE` paths).

---

## 4) Network

```powershell
netstat -abno                                                             # all connections + listeners with owning process NAME and PID (admin; -b needs elevation)
Get-NetTCPConnection -State Established |
  Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort,
    @{n='Process';e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}} |
  Sort-Object RemoteAddress                                               # established connections joined to process names — the beaconing check
Get-NetTCPConnection -State Listen |
  Select-Object LocalAddress, LocalPort,
    @{n='Process';e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}}  # what is listening, and which process opened it
Get-DnsClientCache | Select-Object Entry, Data | Sort-Object Entry        # DNS cache — domains this host resolved recently, even if the connection is gone
Get-DnsClientCache | Where-Object Entry -match '\.(top|xyz|click|zip)$'   # quick cut for domains on abuse-heavy TLDs (a lead, not a verdict)
Get-SmbSession 2>$null; Get-SmbOpenFile 2>$null                           # who is connected to this host's shares and what files they have open (servers)
Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, DNSServer  # interface + DNS server sanity check — attacker-set DNS redirects everything
```

---

## 5) Logging Setup (Hardening)

Do this on your own systems **before** you need the logs. Background: [[Security-Logging-and-Detection]].

### PowerShell script block logging

Records the content of every script block PowerShell executes (Event ID 4104, `Microsoft-Windows-PowerShell/Operational`) — including de-obfuscated code. The single highest-value Windows logging switch.

```powershell
New-Item -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging' -Force | Out-Null
Set-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging' -Name EnableScriptBlockLogging -Value 1   # enable 4104 logging
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104} -MaxEvents 20 |
  Format-List TimeCreated, Message                                        # verify it works / review recent script blocks
```

(Via GPO instead: Computer Configuration → Administrative Templates → Windows Components → Windows PowerShell. Add module logging and transcription there for full coverage.)

### Sysmon

Detailed process/network/file/DNS telemetry (see SOC-Analyst-Playbook.md §4 for the event IDs). Install with a curated config — the **SwiftOnSecurity sysmon-config** (`github.com/SwiftOnSecurity/sysmon-config`) is the standard sane baseline; review it, then:

```powershell
sysmon64.exe -accepteula -i sysmonconfig-export.xml                       # install Sysmon service with the config
sysmon64.exe -c                                                           # show active config
sysmon64.exe -c sysmonconfig-export.xml                                   # update config in place after edits
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} -MaxEvents 10 |
  Format-List TimeCreated, Message                                        # verify: recent process-creation events flowing
```

### Audit policy + command line in 4688

```powershell
auditpol /get /category:*                                                 # current audit policy — know what you are and aren't logging
auditpol /set /subcategory:"Process Creation" /success:enable             # turn on 4688 process-creation auditing
auditpol /set /subcategory:"Logon" /success:enable /failure:enable        # ensure both 4624 and 4625 are recorded
New-Item -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\Audit' -Force | Out-Null
Set-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\Audit' `
  -Name ProcessCreationIncludeCmdLine_Enabled -Value 1                    # include full command line in 4688 — without this it's half-blind
wevtutil sl Security /ms:1073741824                                       # grow Security log to 1 GB — default sizes roll over in hours
```

**Ship logs off-host** (Windows Event Forwarding or an agent to your SIEM) — same rule as the Linux sheet: logs that exist only on a compromised host belong to the attacker.

---

## 6) Triage One-Liners

Fast evidence sweeps for a host you are authorized to investigate. Read-only; run elevated.

```powershell
Get-ChildItem C:\Users -Recurse -File -Force -ErrorAction SilentlyContinue |
  Where-Object LastWriteTime -gt (Get-Date).AddHours(-24) |
  Sort-Object LastWriteTime -Descending | Select-Object LastWriteTime, FullName -First 40   # user-profile files touched in the last 24h
Get-ChildItem C:\Users\*\AppData\Local\Temp, C:\Windows\Temp -Include *.exe,*.dll,*.ps1,*.bat,*.vbs -Recurse -Force -ErrorAction SilentlyContinue |
  Select-Object LastWriteTime, Length, FullName                           # executables sitting in temp directories — staging ground check
Get-ChildItem C:\Windows\Prefetch -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending | Select-Object LastWriteTime, Name -First 30       # prefetch = evidence of execution, even after deletion
Get-LocalUser | Select-Object Name, Enabled, LastLogon; Get-LocalGroupMember Administrators  # quick user + admin-group dump for the ticket
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4720,4732,1102; StartTime=(Get-Date).AddDays(-7)} -ErrorAction SilentlyContinue |
  Format-List TimeCreated, Id, Message                                    # accounts created, added to privileged groups, logs cleared — last 7 days
Get-FileHash <file> -Algorithm SHA256                                     # hash an artifact BEFORE anything else — lookup + evidence log
Get-ChildItem 'C:\Users\*\AppData\Roaming\Microsoft\Windows\Recent' -Force -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending | Select-Object LastWriteTime, Name -First 20       # recently opened documents per user (LNK artifacts)
```

---

## Related

- SOC-Analyst-Playbook.md — the event IDs above in investigation context (big 5 alert walkthroughs)
- Linux-Security-Cheat-Sheet.md — same structure for the Linux side
- Incident-Response-Playbook.md — order of volatility and evidence handling before you run anything on a live suspect host
- [[Security-Logging-and-Detection]] — why these log sources and how detections are built on them
