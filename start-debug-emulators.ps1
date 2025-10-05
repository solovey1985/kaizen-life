# Debug Firebase Functions Script
# This script starts the emulators in debug mode for VS Code debugging

Write-Host "Starting Firebase Functions in Debug Mode..." -ForegroundColor Yellow
Write-Host ""

# Ensure we're in the project directory
$projectRoot = "G:\Projects\kaizen-life"
$currentPath = (Get-Location).Path
if ($currentPath -ne $projectRoot) {
    Write-Host "Changing to project directory: $projectRoot" -ForegroundColor Cyan
    Set-Location $projectRoot
}

# Build functions first
Write-Host "Building functions..." -ForegroundColor Cyan
Push-Location "functions"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Fix compilation errors before debugging." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "Functions built successfully" -ForegroundColor Green
Write-Host ""

# Create emulator data directory if it doesn't exist
$emulatorDataPath = "../kaizen-life-emulator-data"
if (!(Test-Path $emulatorDataPath)) {
    Write-Host "Creating emulator data directory: $emulatorDataPath" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $emulatorDataPath -Force | Out-Null
}

Write-Host "Starting Firebase Emulators in Debug Mode..." -ForegroundColor Yellow
Write-Host "   Functions will be available on port 5001" -ForegroundColor Cyan
Write-Host "   Debug port will be available on port 9229" -ForegroundColor Cyan
Write-Host "   Emulator UI: http://localhost:5600" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps for debugging:" -ForegroundColor Green
Write-Host "   1. Wait for emulators to start completely" -ForegroundColor Gray
Write-Host "   2. In VS Code, press F5 and select 'Attach to Functions Emulator'" -ForegroundColor Gray
Write-Host "   3. Set breakpoints in your TypeScript files" -ForegroundColor Gray
Write-Host "   4. Make API calls to trigger your functions" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop emulators (data will auto-save)" -ForegroundColor Yellow
Write-Host ""

# Start emulators with debug mode and data persistence
firebase emulators:start --inspect-functions --import=$emulatorDataPath --export-on-exit=$emulatorDataPath