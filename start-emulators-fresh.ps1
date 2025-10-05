# Start Firebase emulators without data persistence (fresh start each time)
# Use this when you want to reset all data or test with clean state

Write-Host "🔥 Starting KaizenLife Firebase Emulators (Fresh Data)..." -ForegroundColor Yellow
Write-Host ""

# Ensure we're in the project directory
$projectRoot = "G:\Projects\kaizen-life"
if ((Get-Location | Select-Object -ExpandProperty Path) -ne $projectRoot) {
    Write-Host "📂 Changing to project directory: $projectRoot" -ForegroundColor Cyan
    Set-Location $projectRoot
}

# Build Angular app if needed
$angularDistPath = "apps/web/kaizen-web/dist"
if (!(Test-Path $angularDistPath)) {
    Write-Host "🔨 Building Angular app..." -ForegroundColor Cyan
    Push-Location "apps/web/kaizen-web"
    npm run build
    Pop-Location
}

Write-Host "🚀 Starting emulators (no data persistence)..." -ForegroundColor Yellow
Write-Host "   📍 Emulator UI: http://localhost:5600" -ForegroundColor Cyan
Write-Host "   🌐 Angular App: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   🔌 Functions API: http://localhost:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Data will NOT be saved between sessions" -ForegroundColor Red
Write-Host "🛑 Press Ctrl+C to stop emulators" -ForegroundColor Yellow
Write-Host ""

# Start emulators without persistence
firebase emulators:start