# Start Firebase emulators with persistent data outside git repo
# This script handles common issues and provides helpful feedback

Write-Host "🔥 Starting KaizenLife Firebase Emulators..." -ForegroundColor Yellow
Write-Host ""

# Ensure we're in the project directory
$projectRoot = "G:\Projects\kaizen-life"
if (Get-Location | Select-Object -ExpandProperty Path) -ne $projectRoot) {
    Write-Host "📂 Changing to project directory: $projectRoot" -ForegroundColor Cyan
    Set-Location $projectRoot
}

# Check if Java is available (required for Firestore emulator)
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java found: $($javaVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found! Please install Java 11+ for Firestore emulator" -ForegroundColor Red
    Write-Host "   Install with: winget install Microsoft.OpenJDK.11" -ForegroundColor Yellow
    exit 1
}

# Check if Firebase CLI is available
try {
    $firebaseVersion = firebase --version 2>&1
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found! Please install with: npm install -g firebase-tools" -ForegroundColor Red
    exit 1
}

# Create emulator data directory if it doesn't exist
$emulatorDataPath = "../kaizen-life-emulator-data"
if (!(Test-Path $emulatorDataPath)) {
    Write-Host "📁 Creating emulator data directory: $emulatorDataPath" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $emulatorDataPath -Force | Out-Null
}

# Build Angular app if dist doesn't exist
$angularDistPath = "apps/web/kaizen-web/dist"
if (!(Test-Path $angularDistPath)) {
    Write-Host "🔨 Building Angular app (first time)..." -ForegroundColor Cyan
    Push-Location "apps/web/kaizen-web"
    npm run build
    Pop-Location
    Write-Host "✅ Angular app built successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Angular app already built" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting emulators with data persistence..." -ForegroundColor Yellow
Write-Host "   📍 Emulator UI: http://localhost:5600" -ForegroundColor Cyan
Write-Host "   🌐 Angular App: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   🔌 Functions API: http://localhost:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "💾 Data will be saved to: $emulatorDataPath" -ForegroundColor Green
Write-Host "🛑 Press Ctrl+C to stop emulators (data will auto-save)" -ForegroundColor Yellow
Write-Host ""

# Start emulators with data persistence
firebase emulators:start --import=$emulatorDataPath --export-on-exit=$emulatorDataPath