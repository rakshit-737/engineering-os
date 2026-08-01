param(
    [Parameter(Mandatory = $true)]
    [string]$SourceDir,
    [Parameter(Mandatory = $true)]
    [string]$BackupDir
)

if (-not (Test-Path $SourceDir)) {
    Write-Error "Source directory not found: $SourceDir"
    exit 1
}

if (-not (Test-Path $BackupDir)) {
    New-Item -Path $BackupDir -ItemType Directory | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "engineering-os-backup-$timestamp.zip"
$zipPath = Join-Path $BackupDir $zipName

Compress-Archive -Path (Join-Path $SourceDir "*") -DestinationPath $zipPath -Force
Write-Output "Backup created: $zipPath"
