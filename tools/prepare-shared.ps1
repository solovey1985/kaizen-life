Param(
    [switch]$Quiet
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info($msg) {
    if (-not $Quiet) { Write-Host "[prepare-shared] $msg" -ForegroundColor Cyan }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$sharedDir = Join-Path $repoRoot 'packages/shared'
$functionsVendor = Join-Path $repoRoot 'functions/vendor'
$webVendor = Join-Path $repoRoot 'apps/web/kaizen-web/vendor'

Write-Info "Building @kaizen/shared..."
npm --prefix $sharedDir run build | Out-Null

Write-Info "Packing @kaizen/shared..."
Push-Location $sharedDir
$packOutput = npm pack
Pop-Location

$tgzName = ($packOutput | Select-Object -Last 1).Trim()
if (-not $tgzName -or -not (Test-Path (Join-Path $sharedDir $tgzName))) {
    throw "Failed to produce npm pack tarball for @kaizen/shared. Output: $packOutput"
}

$srcTgz = Join-Path $sharedDir $tgzName
$stableName = '@kaizen-shared.tgz'

Write-Info "Preparing vendor directories..."
New-Item -ItemType Directory -Force -Path $functionsVendor | Out-Null
New-Item -ItemType Directory -Force -Path $webVendor | Out-Null

Write-Info "Copying tarball to functions/vendor/$stableName"
Copy-Item -Path $srcTgz -Destination (Join-Path $functionsVendor $stableName) -Force

Write-Info "Copying tarball to web/vendor/$stableName"
Copy-Item -Path $srcTgz -Destination (Join-Path $webVendor $stableName) -Force

Write-Info "Cleaning temporary tarball from shared package"
Remove-Item -Path $srcTgz -Force

Write-Info "Done."
