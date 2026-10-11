$ErrorActionPreference = 'Stop'
$appUrl = 'http://127.0.0.1:4180'
$nodeBinary = (Get-Command node).Source
$nodeMajor = [int]((& $nodeBinary --version).TrimStart('v').Split('.')[0])
if ($nodeMajor -lt 22) { throw 'Install Node.js 22 or newer from https://nodejs.org' }
function Get-JarvisStatus {
  try { return Invoke-RestMethod -Uri "$appUrl/api/status" -TimeoutSec 2 } catch { return $null }
}
$status = Get-JarvisStatus
if ($status -and $status.app -eq 'jarvis-local-v1') { Start-Process $appUrl; exit 0 }
$server = Join-Path $PSScriptRoot 'server.cjs'
$dataDir = Join-Path $PSScriptRoot 'data'
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$proc = Start-Process -FilePath $nodeBinary -ArgumentList @('"' + $server + '"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -RedirectStandardError (Join-Path $dataDir 'server-error.log') -RedirectStandardOutput (Join-Path $dataDir 'server.log')
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 300
  $status = Get-JarvisStatus
  if ($status -and $status.app -eq 'jarvis-local-v1') { Start-Process $appUrl; exit 0 }
  if ($proc.HasExited) { break }
}
throw 'JARVIS could not start. Close any other app using port 4180, then try again. See data/server-error.log for startup details.'
