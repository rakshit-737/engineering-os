# Linux Security Cheat Sheet

> Defender's reference for **hardening** systems you administer and **investigating** systems you are authorized to defend. Commands assume a modern systemd distro (Debian/Ubuntu/RHEL family). Run investigation commands as root/sudo where noted; prefer read-only commands during an active incident (see Incident-Response-Playbook order of volatility).

---

## 1) System Recon / Baseline

Know what "normal" looks like before you need to spot "abnormal".

```bash
uname -a                              # kernel version — check against known-vuln kernels
cat /etc/os-release                   # distro and version — determines patch status
hostnamectl                           # hostname, machine ID, virtualization type
uptime                                # unexpected recent reboot can indicate tampering
id                                    # current UID/GID and group memberships
ip a                                  # interfaces and addresses — spot unexpected interfaces
df -h                                 # disk usage — sudden fill can be log flooding or staging
ps auxf --sort=-%cpu | head -20       # process tree by CPU — odd parents/children stand out
```

---

## 2) Users & Authentication

### Investigate

```bash
w                                     # who is logged in right now and what they're running
last -aiF | head -30                  # login history with full timestamps and source IPs
sudo lastb | head -30                 # failed login attempts (reads /var/log/btmp)
lastlog                               # last login per account — dormant accounts that suddenly log in
awk -F: '$3 == 0 {print $1}' /etc/passwd     # accounts with UID 0 — should ONLY be root
sudo awk -F: '$2 == "" {print $1}' /etc/shadow    # accounts with empty passwords
awk -F: '$7 !~ /(nologin|false)/ {print $1}' /etc/passwd  # accounts with a real login shell
grep -E 'sudo|wheel|admin' /etc/group        # who has sudo-capable group membership
sudo cat /etc/sudoers /etc/sudoers.d/* 2>/dev/null  # sudo rules — look for NOPASSWD and recent additions
find /home /root -name authorized_keys -exec ls -la {} \; 2>/dev/null  # SSH keys — any you didn't add?
stat /etc/passwd /etc/shadow /etc/sudoers     # modification times — recent change = investigate
```

### Harden

```bash
sudo passwd -l <user>                 # lock an account without deleting it (preserves evidence)
sudo usermod -s /usr/sbin/nologin <user>   # remove login shell from service accounts
sudo chage -M 90 -W 14 <user>         # password max age 90 days, warn 14 days before
sudo chage -l <user>                  # review a user's password aging policy
```

**SSH hardening — `/etc/ssh/sshd_config`** (then `sudo systemctl reload sshd`):

```
# NOTE: sshd_config does NOT allow inline comments after a directive —
# keep comments on their own lines like this file does.

# Keys only — kills password brute force
PasswordAuthentication no
# Force login as named user + sudo (audit trail)
PermitRootLogin no
# Slow down guessing
MaxAuthTries 3
# Explicit allowlist of who may SSH
AllowGroups ssh-users
# Disable unless genuinely needed
X11Forwarding no
```

```bash
sudo sshd -t                          # syntax-check sshd_config BEFORE reloading
sudo apt install fail2ban             # auto-ban IPs after repeated auth failures
sudo fail2ban-client status sshd      # verify the ssh jail is active and see banned IPs
```

---

## 3) File Permissions, SUID/SGID & Sensitive Files

### Investigate

```bash
find / -perm -4000 -type f 2>/dev/null            # all SUID binaries — diff against a known-good baseline
find / -perm -2000 -type f 2>/dev/null            # all SGID binaries
find / -perm -4000 -newer /etc/hostname 2>/dev/null  # SUID files newer than a reference file — recent additions
find / -writable -type d ! -path "/proc/*" ! -path "/sys/*" 2>/dev/null | head  # world/user-writable dirs
find / -perm -o+w -type f ! -path "/proc/*" ! -path "/sys/*" 2>/dev/null | head # world-writable files
find /etc -writable -type f 2>/dev/null           # config files the current user can modify (should be none)
ls -la /etc/passwd /etc/shadow /etc/gshadow       # shadow must be root:shadow 640 or stricter
find / -nouser -o -nogroup 2>/dev/null | head     # orphaned files — leftovers from deleted accounts
getcap -r / 2>/dev/null                           # file capabilities — cap_setuid etc. are SUID-equivalent
lsattr /etc/passwd /etc/shadow 2>/dev/null        # immutable/append flags — attackers use +i to lock in changes
```

### Harden

```bash
chmod 600 <keyfile>                   # private keys: owner read/write only
chmod 700 ~/.ssh                      # SSH dir must not be group/world accessible
sudo chown root:root /etc/cron.d/*    # cron drop-ins owned by root
sudo chmod o-rx /home/*               # stop users reading each other's home dirs
umask 027                             # default-deny for new files (set in /etc/profile.d/)
sudo dpkg --verify | head             # Debian: files changed from packaged version
sudo rpm -Va | head                   # RHEL: verify all packages (5 = md5 mismatch on config/bin)
```

---

## 4) Network — ss / iptables / nftables

### Investigate

```bash
ss -tulpen                            # all listening TCP/UDP sockets with owning process — anything unexpected?
ss -tupn                              # established connections — unknown remote IPs?
ss -tupn state established '( dport = :443 or dport = :80 )'  # outbound web — beaconing check
sudo lsof -nPi                        # map every network socket to a process and user
ip route                              # routing table — unexpected routes/redirects
ip neigh                              # ARP cache — duplicate MACs can indicate spoofing on LAN
cat /etc/resolv.conf                  # DNS servers — attacker-changed DNS redirects everything
resolvectl status                     # systemd-resolved view of actual DNS in use
sudo tcpdump -i any -nn -c 100 'not port 22'  # quick live traffic sample (authorized systems only)
```

### iptables (legacy/compat)

```bash
sudo iptables -L -v -n --line-numbers # list all rules with packet counters — hit counts reveal activity
sudo iptables -S                      # rules in restorable format — save a copy as evidence/baseline
sudo iptables -P INPUT DROP           # default-deny inbound (add allow rules FIRST or you lock yourself out)
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT  # allow return traffic
sudo iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/24 -j ACCEPT  # SSH only from admin subnet
sudo iptables -A INPUT -j LOG --log-prefix "DROP-IN: "  # log what the default policy drops
```

### nftables (modern)

```bash
sudo nft list ruleset                 # entire firewall state in one view
sudo nft list ruleset > /root/nft-baseline-$(date +%F).txt  # snapshot baseline for later diff
sudo nft add table inet filter        # create table (inet = IPv4+IPv6 together)
sudo nft add chain inet filter input '{ type filter hook input priority 0; policy drop; }'  # default-deny chain
sudo nft add rule inet filter input ct state established,related accept   # allow return traffic
sudo nft add rule inet filter input tcp dport 22 ip saddr 10.0.0.0/24 accept  # scoped SSH allow
sudo nft add rule inet filter input counter log prefix '"nft-drop: "' drop    # log-and-drop everything else
```

### ufw (simple frontend)

```bash
sudo ufw status verbose               # current policy and rules at a glance
sudo ufw default deny incoming        # default-deny inbound
sudo ufw allow from 10.0.0.0/24 to any port 22 proto tcp  # scoped SSH
sudo ufw enable                       # activate (confirm SSH rule exists first)
```

---

## 5) Logs — journalctl / auth.log

```bash
sudo journalctl -xe                   # most recent log entries with context — first stop
sudo journalctl --since "-2h"         # everything in the last two hours
sudo journalctl -u sshd --since today # one service's logs for today
sudo journalctl -p err..alert --since "-24h"  # only errors and worse, last 24h
sudo journalctl _UID=1001 --since "-24h"      # everything a specific user's processes logged
sudo journalctl --list-boots          # boot history — unexplained reboots
sudo journalctl --verify              # check journal files for corruption/tampering
sudo tail -n 200 /var/log/auth.log    # recent auth events (Debian/Ubuntu; RHEL: /var/log/secure)
sudo grep -i "failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head  # top brute-force source IPs
sudo grep -i "accepted" /var/log/auth.log     # SUCCESSFUL logins — the failures that worked
sudo grep -i "sudo" /var/log/auth.log | grep -i "command" | tail -20  # what was run with sudo, by whom
sudo grep -i "useradd\|usermod\|groupadd" /var/log/auth.log  # account changes — expected?
sudo ausearch -m avc --start today 2>/dev/null # SELinux denials today (RHEL family)
ls -la /var/log/                      # zero-byte or missing logs = possible log wiping
sudo journalctl --disk-usage          # journal size — sudden shrink can mean cleared logs
```

**Hardening note:** ship logs off-host (rsyslog/journald-remote to a log server or SIEM). Logs that only exist on a compromised host are logs the attacker controls.

```bash
sudo mkdir -p /etc/systemd/journald.conf.d && printf '[Journal]\nStorage=persistent\n' | sudo tee /etc/systemd/journald.conf.d/persist.conf   # keep journal across reboots
```

---

## 6) Persistence Checks — cron / systemd / shells

Where attackers hide re-entry mechanisms. Check **all** of these during eradication.

### Cron

```bash
crontab -l                            # current user's crontab
sudo ls -la /var/spool/cron/crontabs/ # every user's crontab files (Debian path)
for u in $(cut -f1 -d: /etc/passwd); do sudo crontab -u "$u" -l 2>/dev/null && echo "^-- $u"; done  # dump all users' crontabs
cat /etc/crontab                      # system crontab — check for recently added lines
ls -la /etc/cron.d/ /etc/cron.hourly/ /etc/cron.daily/ /etc/cron.weekly/ /etc/cron.monthly/  # drop-in jobs with mtimes
sudo ls -la /var/spool/at/ 2>/dev/null && atq   # one-shot 'at' jobs — often forgotten hiding spot
```

### systemd

```bash
systemctl list-units --type=service --state=running   # what's running — anything unrecognized?
systemctl list-unit-files --state=enabled             # what starts at boot
systemctl list-timers --all           # systemd timers — the modern cron, often overlooked
find /etc/systemd/system /usr/lib/systemd/system -name "*.service" -newermt "-30 days" 2>/dev/null  # recently added/modified units
systemctl cat <service>               # inspect a unit's actual ExecStart before trusting its name
ls -la /etc/systemd/system/*.wants/   # enable symlinks — units wired into boot targets
find ~/.config/systemd/user/ -type f 2>/dev/null      # per-user units — persistence without root
```

### Shell startup, preload & other classics

```bash
cat ~/.bashrc ~/.bash_profile ~/.profile 2>/dev/null | grep -vE '^#|^$'  # injected commands run at every login
sudo cat /etc/profile /etc/bash.bashrc /etc/profile.d/*.sh | grep -vE '^#|^$' | head -40  # system-wide shell startup
cat /etc/ld.so.preload 2>/dev/null    # should be EMPTY — preloaded libs hook every binary (rootkit classic)
echo $LD_PRELOAD                      # should be empty in normal sessions
sudo ls -la /etc/init.d/              # legacy SysV scripts still execute on some distros
cat /etc/rc.local 2>/dev/null         # legacy boot script — should be absent or trivial
lsmod | head -20                      # loaded kernel modules — compare to baseline
sudo find /root /home -name ".*" -mtime -7 -type f 2>/dev/null | head  # recently changed dotfiles
```

### Harden

```bash
sudo systemctl disable --now <service>    # disable and stop an unneeded service in one step
sudo systemctl mask <service>             # prevent a service from EVER being started (stronger than disable)
sudo chmod 600 /etc/crontab               # stop non-root users reading scheduled jobs
echo "root" | sudo tee /etc/cron.allow    # allowlist who may create cron jobs
```

---

## 7) File Integrity

Detect unauthorized changes to system files.

```bash
sudo apt install aide && sudo aideinit    # install AIDE and build the initial integrity database
sudo aide --check                         # compare filesystem against the AIDE baseline
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db  # accept current state as new baseline (only after verifying!)
sudo dpkg --verify                        # Debian: report files that differ from package manifests
sudo rpm -Va                              # RHEL: verify all installed packages (S=size, 5=hash, M=mode changed)
sudo debsums -c 2>/dev/null | head        # Debian: changed files by checksum (apt install debsums)
sha256sum /usr/bin/ssh /usr/bin/sudo /bin/bash  # spot-hash critical binaries; compare to package or known-good
find /etc -mtime -7 -type f 2>/dev/null   # config files modified in the last week — explain each one
find /usr/bin /usr/sbin -mtime -7 -type f 2>/dev/null  # system binaries modified recently — should be package updates only
stat -c '%n %y %z' /usr/bin/ssh           # mtime vs ctime — mtime older than ctime can indicate timestomping
sudo chattr +i /etc/passwd                # make a file immutable (deliberate hardening — document it!)
lsattr /etc/passwd                        # verify/inspect the immutable flag
```

**Practice:** snapshot baselines (`aide`, `nft list ruleset`, SUID list, enabled services) right after a clean build, store them **off the host**, and diff during investigations.

---

## 8) Quick Hardening Checklist

- [ ] All packages updated; unattended security updates enabled (`unattended-upgrades` / `dnf-automatic`)
- [ ] SSH: keys only, no root login, allowlisted group, fail2ban active
- [ ] Firewall default-deny inbound; every open port justified in writing
- [ ] No unused services running (`systemctl list-units --type=service --state=running` — justify each)
- [ ] Least privilege: no shared accounts, sudo scoped per-user, no `NOPASSWD: ALL`
- [ ] Separate partitions with `nodev,nosuid,noexec` on `/tmp` and `/var/tmp` where feasible
- [ ] Logs persistent locally AND shipped off-host
- [ ] AIDE (or equivalent) baseline created and checked on a schedule
- [ ] Backups: automated, tested restore, one copy offline/immutable
- [ ] Baselines snapshotted off-host: SUID list, service list, firewall ruleset, crontabs
