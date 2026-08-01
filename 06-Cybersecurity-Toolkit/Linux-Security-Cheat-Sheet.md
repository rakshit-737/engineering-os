# Linux Security Cheat Sheet

## System Recon

```bash
uname -a
cat /etc/os-release
id
whoami
ip a
ss -tulpen
ps aux --sort=-%mem | head
```

## File Permissions

```bash
ls -la
find / -type f -perm -4000 2>/dev/null
chmod 600 secret.txt
chown user:group file
```

## Log Analysis

```bash
journalctl -xe
sudo tail -n 200 /var/log/auth.log
sudo grep -i "failed" /var/log/auth.log
```

## Process and Service Hardening

```bash
systemctl list-units --type=service --state=running
sudo systemctl disable <service>
sudo ufw status verbose
```

## Useful Security Checks

- Remove unused services
- Disable password SSH auth where possible
- Enforce least privilege via groups
- Audit cron jobs and startup scripts