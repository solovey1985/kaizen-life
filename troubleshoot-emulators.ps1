# Troubleshoot Firebase Emulators for KaizenLife
# This script helps diagnose common issues

Write-Host "🔍 KaizenLife Emulator Troubleshooting" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host ""

# Check Java
Write-Host "1. Checking Java..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1
    Write-Host "   ✅ Java found: $($javaVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Java not found! Install with: winget install Microsoft.OpenJDK.11" -ForegroundColor Red
}

# Check Firebase CLI
Write-Host ""
Write-Host "2. Checking Firebase CLI..." -ForegroundColor Cyan
try {
    $firebaseVersion = firebase --version 2>&1
    Write-Host "   ✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Firebase CLI not found! Install with: npm install -g firebase-tools" -ForegroundColor Red
}

# Check Node.js
Write-Host ""
Write-Host "3. Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>&1
    Write-Host "   ✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found! Install from: https://nodejs.org" -ForegroundColor Red
}

# Check ports
Write-Host ""
Write-Host "4. Checking for port conflicts..." -ForegroundColor Cyan
$ports = @(5000, 5001, 5100, 5600, 9099)
foreach ($port in $ports) {
    $connection = netstat -ano | findstr ":$port"
    if ($connection) {
        Write-Host "   ⚠️  Port $port is in use:" -ForegroundColor Yellow
        Write-Host "      $connection" -ForegroundColor Gray
    } else {
        Write-Host "   ✅ Port $port is available" -ForegroundColor Green
    }
}

# Check project structure
Write-Host ""
Write-Host "5. Checking project structure..." -ForegroundColor Cyan
$requiredPaths = @(
    "firebase.json",
    "apps/web/kaizen-web",
    "apps/functions",
    "packages/shared"
)

foreach ($path in $requiredPaths) {
    if (Test-Path $path) {
        Write-Host "   ✅ Found: $path" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing: $path" -ForegroundColor Red
    }
}

# Check Angular build
Write-Host ""
Write-Host "6. Checking Angular build..." -ForegroundColor Cyan
if (Test-Path "apps/web/kaizen-web/dist") {
    Write-Host "   ✅ Angular app is built" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Angular app needs to be built" -ForegroundColor Yellow
    Write-Host "      Run: cd apps/web/kaizen-web && npm run build" -ForegroundColor Gray
}

# Check emulator data directory
Write-Host ""
Write-Host "7. Checking emulator data directory..." -ForegroundColor Cyan
if (Test-Path "../kaizen-life-emulator-data") {
    Write-Host "   ✅ Emulator data directory exists" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Emulator data directory will be created on first run" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🛠️  Troubleshooting Tips:" -ForegroundColor Yellow
Write-Host "   • Kill processes using ports: Get-Process -Id <PID> | Stop-Process" -ForegroundColor Gray
Write-Host "   • Reset emulator data: Remove-Item -Recurse ../kaizen-life-emulator-data" -ForegroundColor Gray
Write-Host "   • Rebuild Angular: cd apps/web/kaizen-web && npm run build" -ForegroundColor Gray
Write-Host "   • Check logs: firebase-debug.log, firestore-debug.log" -ForegroundColor Gray
Write-Host ""