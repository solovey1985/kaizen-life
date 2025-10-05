# Firebase Functions Debugging Guide

This guide covers various methods to debug Firebase Functions in the KaizenLife project.

## 🔧 Quick Debugging Methods

### 1. Console Logging (Recommended for Quick Debugging)

The functions now include detailed console logging. Start the emulators and watch the logs:

```powershell
# Start functions emulator with logging
cd functions
npm run serve

# Or use the project root script
.\start-emulators.ps1
```

**View logs in:**
- Terminal output where emulators are running
- Emulator UI at http://localhost:5600 → Functions tab
- `firebase-debug.log` file

### 2. VS Code Debugging (Advanced)

#### Method A: Using Debug Script (Recommended)

1. **Start functions in debug mode:**
   ```powershell
   .\start-debug-emulators.ps1
   ```

2. **Wait for emulators to start completely** (you'll see "All emulators ready!")

3. **In VS Code:**
   - Press `F5` or go to Run & Debug
   - Select "Attach to Functions Emulator" 
   - Set breakpoints in your TypeScript files (`functions/src/*.ts`)

4. **Test your functions:**
   ```powershell
   # Make API calls to trigger breakpoints
   curl http://localhost:5001/kaizen-life-dev/us-central1/api/balance/test-user
   ```

#### Method B: Manual Debugging

1. **Start functions in debug mode:**
   ```powershell
   cd functions
   npm run build
   cd ..
   firebase emulators:start --only functions --inspect-functions
   ```

2. **In VS Code:**
   - Press `F5` → "Attach to Functions Emulator"
   - Debug port: 9229 (automatically configured)

#### ⚠️ Common Debug Issues

**"Failed to load environment variables from .env":**
- **Cause**: Complex environment loading in Firebase Functions context
- **Solution**: Use simplified environment detection (already implemented)
- **Check**: Ensure `.env` file is minimal and in `functions/` directory

**Debugger Disconnects Immediately:**
- This happens when trying to launch functions directly (not supported)
- **Solution**: Always use "Attach" mode, not "Launch" mode
- Start emulators first, then attach debugger

**Breakpoints Not Hit:**
- Ensure functions are built: `npm run build`
- Verify source maps are enabled in `tsconfig.json`
- Check that you're setting breakpoints in `.ts` files, not `.js` files

**Cannot Attach to Debug Port:**
- Make sure emulators started with `--inspect-functions` flag
- Check that port 9229 is not in use by another process
- Restart emulators if debug port is stuck

**Functions Won't Start:**
- Check for TypeScript compilation errors: `npm run build`
- Verify all dependencies are installed: `npm install`
- Check Firebase project configuration: `firebase use --add`

### 3. Firebase Functions Shell (Interactive Debugging)

```powershell
cd functions
npm run shell
```

**In the shell, test functions directly:**
```javascript
// Test the api function
api({
  method: 'POST',
  url: '/actions/add',
  body: {
    userId: 'test-user',
    actionTypeId: 'workout-cardio', 
    amount: 30
  }
})
```

## 🚀 Debugging Workflow

### Step 1: Enable Detailed Logging

Functions now include emoji-coded logs for easy scanning:
- 🚀 Function entry points
- 📝 Parameter extraction
- ✅ Successful operations
- ❌ Errors and failures
- 💰 Credit calculations
- 🔄 Transaction starts
- 💼 Balance updates

### Step 2: Choose Your Debugging Method

| Method | When to Use | Difficulty |
|--------|-------------|------------|
| **Console Logging** | Quick debugging, seeing execution flow | Easy |
| **VS Code Debugging** | Complex issues, step-through debugging | Medium |
| **Functions Shell** | Testing individual functions | Easy |

### Step 3: Debug Workflow

#### For Quick Issues (Console Logging):
```powershell
# 1. Start emulators with logging
.\start-emulators.ps1

# 2. Make API calls and watch logs
curl http://localhost:5001/kaizen-life-dev/us-central1/api/actions/add \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","actionTypeId":"workout","amount":1}'

# 3. Check terminal for detailed logs with emojis
```

#### For Complex Issues (VS Code Debugging):
```powershell
# 1. Start debug emulators
.\start-debug-emulators.ps1

# 2. Wait for "All emulators ready!" message

# 3. In VS Code: F5 → "Attach to Functions Emulator"

# 4. Set breakpoints in TypeScript files

# 5. Make API calls to trigger breakpoints
```

### Step 2: Test API Endpoints

```powershell
# Test balance endpoint
curl http://localhost:5001/kaizen-life-dev/us-central1/api/balance/test-user

# Test add action endpoint
curl -X POST http://localhost:5001/kaizen-life-dev/us-central1/api/actions/add \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","actionTypeId":"workout","amount":1}'
```

### Step 3: Monitor Logs

**Terminal Output:**
```
🚀 POST /actions/add called with body: { userId: 'test-user', actionTypeId: 'workout', amount: 1 }
📝 Extracted params: { userId: 'test-user', actionTypeId: 'workout', amount: 1 }
✅ Found actionType: { name: 'Workout', creditValue: 10, type: 'KZ' }
💰 Calculated credits: 10
📋 Creating userAction: { userId: 'test-user', ... }
🔄 Starting balance update transaction for user: test-user
💼 Current balance: { balanceKP: 0, balanceKZ: 50 }
💼 New balance: { balanceKP: 0, balanceKZ: 60 }
✅ Transaction completed successfully
```

## 🛠️ Debug Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run serve` | Start functions emulator normally |
| `npm run debug` | Start functions emulator with debug port |
| `npm run shell` | Interactive functions shell |
| `npm run build:watch` | Auto-rebuild on file changes |
| `npm run logs` | View production function logs |

## 🔍 Troubleshooting Common Issues

### TypeScript Compilation Errors

```powershell
cd functions
npm run build
# Fix any TypeScript errors before debugging
```

### Port Conflicts

```powershell
# Check if port 5001 is in use
netstat -ano | findstr :5001

# Kill process if needed
taskkill /PID <process_id> /F
```

### Missing Dependencies

```powershell
cd functions
npm install
```

### Source Maps Not Working

Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

## 📊 Emulator UI Debugging

Access the Emulator UI at http://localhost:5600:

1. **Functions Tab**: View function logs and execution history
2. **Firestore Tab**: Inspect database state before/after function calls
3. **Auth Tab**: Manage test users for authenticated functions

## 🧪 Testing Strategies

### 1. Unit Testing Functions

```typescript
// Example test setup (add to functions/src/test/)
import { api } from '../index';
import * as request from 'supertest';

describe('API Endpoints', () => {
  test('POST /actions/add', async () => {
    const response = await request(api)
      .post('/actions/add')
      .send({ userId: 'test', actionTypeId: 'workout', amount: 1 });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### 2. Integration Testing

Use the emulator with predefined test data:

```powershell
# Start emulators with test data
firebase emulators:start --import=./test-data
```

## 🔐 Debugging Authenticated Functions

For functions requiring authentication:

1. **Get test token from Auth emulator UI**
2. **Add to request headers:**
   ```powershell
   curl -H "Authorization: Bearer <test-token>" \
     http://localhost:5001/kaizen-life-dev/us-central1/api/balance/test-user
   ```

## 📝 Best Practices

1. **Use structured logging** with consistent emoji codes
2. **Log entry/exit points** of all functions
3. **Log parameter validation** results
4. **Use try/catch blocks** with detailed error logging
5. **Test with emulator UI** before deploying
6. **Keep debug code** for production troubleshooting

## 🚨 Production Debugging

```powershell
# View production logs
firebase functions:log --limit 50

# Follow real-time logs
firebase functions:log --limit 10 --follow
```

Remember: Production logs don't include `console.log()` by default. Use `functions.logger` for production logging.