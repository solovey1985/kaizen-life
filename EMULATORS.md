# Firebase Emulators Guide for KaizenLife

This guide covers how to run, update, and work with Firebase emulators for the KaizenLife project, including data persistence between sessions.

## Prerequisites

- Node.js (v16 or higher)
- Firebase CLI: `npm install -g firebase-tools`
- Java 11+ (required for Firestore emulator)
- Angular CLI: `npm install -g @angular/cli`

## Quick Start

### 1. Initial Setup
```powershell
# Navigate to project root
cd G:\Projects\kaizen-life

# Install dependencies
npm install

# Build the Angular app
cd apps/web/kaizen-web
npm run build
cd ../../..
```

### 2. Start Emulators (Easy Way)
```powershell
# Use the provided script for automatic data persistence
.\start-emulators.ps1
```

### 3. Start Emulators (Manual Way)
```powershell
# Start with data persistence
firebase emulators:start --import="../kaizen-life-emulator-data" --export-on-exit="../kaizen-life-emulator-data"

# Or start without persistence (fresh data each time)
firebase emulators:start
```

## Emulator Configuration

The following emulators are configured in `firebase.json`:

| Service   | Port | Purpose                           |
|-----------|------|-----------------------------------|
| Auth      | 9099 | User authentication              |
| Firestore | 5100 | NoSQL database                   |
| Functions | 5001 | API endpoints                    |
| Hosting   | 5000 | Angular app hosting              |
| Storage   | 5200 | File storage (optional)          |
| UI        | 5600 | Emulator management interface    |

## Access Points

Once emulators are running:

- **Angular App**: http://localhost:5000
- **Emulator UI**: http://localhost:5600
- **Functions API**: http://localhost:5001/kaizen-life-dev/us-central1/api
- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:5100

## Data Persistence

### Automatic Persistence (Recommended)

The `start-emulators.ps1` script automatically:
- Imports existing data from `../kaizen-life-emulator-data/` on startup
- Exports all data to `../kaizen-life-emulator-data/` when you stop emulators (Ctrl+C)

### Manual Data Management

```powershell
# Export current emulator data
firebase emulators:export ../kaizen-life-emulator-data

# Import existing data
firebase emulators:start --import=../kaizen-life-emulator-data

# Reset all data (delete the directory)
Remove-Item -Recurse -Force ../kaizen-life-emulator-data
```

### Data Storage Location

Emulator data is stored **outside** the git repository at:
- `G:\Projects\kaizen-life-emulator-data\` (sibling directory)
- `C:\temp\kaizen-life-emulator-data\` (alternative location)

This prevents emulator data from being committed to version control.

## Working with Emulators

### Development Workflow

1. **Start emulators** with persistent data
2. **Develop** your Angular app and Firebase Functions
3. **Test** using the emulator endpoints
4. **Stop emulators** (Ctrl+C) - data automatically saves
5. **Restart** later with the same data intact

### Testing API Endpoints

```powershell
# Test Functions API health check
curl http://localhost:5001/kaizen-life-dev/us-central1/api/health

# Test with PowerShell
Invoke-RestMethod -Uri "http://localhost:5001/kaizen-life-dev/us-central1/api/health"
```

### Creating Test Data

Use the Emulator UI at http://localhost:5600 to:
- Create test users in Auth emulator
- Add documents to Firestore collections
- View and manage all emulator data

## Building and Deploying

### Build Angular App
```powershell
cd apps/web/kaizen-web
npm run build
cd ../../..
```

### Build Functions
```powershell
cd functions
npm run build
cd ..
```

### Deploy to Emulators
The hosting emulator automatically serves from:
`apps/web/kaizen-web/dist/kaizen-web/browser/`

## Troubleshooting

### Port Conflicts
If you get "port already in use" errors:

```powershell
# Find processes using ports
netstat -ano | findstr :5001
netstat -ano | findstr :5000

# Kill specific process (replace PID)
taskkill /PID <process_id> /F

# Or use different ports in firebase.json
```

### Java Issues
Firestore emulator requires Java 11+:

```powershell
# Check Java version
java -version

# Install OpenJDK if needed
winget install Microsoft.OpenJDK.11
```

### Emulator Data Issues

```powershell
# Reset all emulator data
Remove-Item -Recurse -Force ../kaizen-life-emulator-data

# Or reset specific emulator data
Remove-Item -Recurse -Force ../kaizen-life-emulator-data/auth_export
Remove-Item -Recurse -Force ../kaizen-life-emulator-data/firestore_export
```

### Build Issues

```powershell
# Clean and rebuild Angular app
cd apps/web/kaizen-web
rm -rf dist/
npm run build
cd ../../..

# Clean and rebuild Functions
cd functions
rm -rf lib/
npm run build
cd ..
```

## Scripts Available

| Script | Purpose |
|--------|---------|
| `start-emulators.ps1` | 🚀 Start emulators with automatic data persistence (recommended) |
| `start-emulators-fresh.ps1` | 🔄 Start emulators with fresh data (no persistence) |
| `troubleshoot-emulators.ps1` | 🔍 Diagnose common emulator issues |
| `start-emulators.sh` | 🐧 Linux/Mac version of the start script |

### Usage Examples

```powershell
# Recommended: Start with data persistence
.\start-emulators.ps1

# Start fresh (no saved data)
.\start-emulators-fresh.ps1

# Diagnose issues
.\troubleshoot-emulators.ps1
```

## Environment Setup

### For New Developers

1. Clone the repository
2. Install prerequisites (Node.js, Firebase CLI, Java)
3. Run initial setup commands
4. Start emulators using the provided script
5. Access the app at http://localhost:5000

### Shared Development Data

To share emulator data with team members:
1. Export data: `firebase emulators:export ./shared-data`
2. Commit `shared-data/` folder to git (create separate branch)
3. Other developers import: `firebase emulators:start --import=./shared-data`

## Security Notes

- Emulator Auth tokens are for development only
- Never use emulator endpoints in production
- Emulator data is not encrypted
- Auth emulator accepts any password for ease of testing

## Production Deployment

When ready for production:
```powershell
# Deploy Functions
firebase deploy --only functions

# Deploy Hosting
firebase deploy --only hosting

# Deploy all
firebase deploy
```

## Useful Commands Reference

```powershell
# Start specific emulators only
firebase emulators:start --only auth,firestore
firebase emulators:start --only hosting
firebase emulators:start --only functions

# Check emulator status
firebase emulators:exec --help

# View emulator logs
# Check firebase-debug.log, firestore-debug.log files

# Reset specific Firebase project
firebase use --clear
firebase use <project-id>
```

## Support

For issues with emulators:
1. Check this guide first
2. Review Firebase emulator documentation
3. Check GitHub issues in the project repository
4. Firebase emulator issues: https://github.com/firebase/firebase-tools/issues