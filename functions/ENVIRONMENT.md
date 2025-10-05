# Firebase Functions Environment Setup Guide

## Setting Environment Variables

### For Local Development (Emulator)
Environment variables are loaded from `.env` file automatically. Avoid reserved keys like `GCLOUD_PROJECT` and `FIREBASE_CONFIG` in `.env` — the Firebase CLI sets these for you, and defining them locally can cause the Functions emulator to fail to start.

### For Production Deployment

Use Firebase CLI to set environment variables:

```powershell
# Set database configuration
firebase functions:config:set database.url="https://your-project-default-rtdb.firebaseio.com/"
firebase functions:config:set firestore.database_id="(default)"

# Set project configuration
firebase functions:config:set project.id="your-project-id"

# Set CORS origin for production
firebase functions:config:set cors.origin="https://your-production-domain.com"

# Set API configuration
firebase functions:config:set api.base_url="https://us-central1-your-project.cloudfunctions.net/api"

# View current configuration
firebase functions:config:get

# Deploy functions with new config
firebase deploy --only functions
```

## Environment Variable Reference

| Variable | Purpose | Local (.env) | Production (Firebase Config) |
|----------|---------|-------------|------------------------------|
| `DATABASE_URL` | Realtime Database URL | ✅ | `database.url` |
| `FIRESTORE_DATABASE_ID` | Firestore Database ID | ✅ | `firestore.database_id` |
| `GCLOUD_PROJECT` | Project ID | ❌ (reserved; set by Firebase) | `project.id` |
| `CORS_ORIGIN` | Allowed CORS origin | ✅ | `cors.origin` |
| `NODE_ENV` | Environment mode | ✅ | Auto-set |
| `LOG_LEVEL` | Logging level | ✅ | N/A |

## Usage in Code

```typescript
import { getEnvironmentConfig, getLogger } from "./config/environment";

const config = getEnvironmentConfig();
const logger = getLogger();

// Access configuration
console.log(config.database.url);
console.log(config.project.id);

// Use logger
logger.info("Application started");
logger.debug("Debug information", { data: "example" });
logger.error("Error occurred", error);
```

## Local Development Setup

1. **Copy environment template:**
   ```powershell
   cd functions
   cp .env.example .env
   ```

2. **Update .env file with your values**

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Start emulators:**
   ```powershell
   npm run serve
   ```

## Production Deployment

1. **Set production environment variables:**
   ```powershell
   firebase functions:config:set database.url="YOUR_PRODUCTION_DB_URL"
   firebase functions:config:set cors.origin="YOUR_PRODUCTION_DOMAIN"
   ```

2. **Deploy:**
   ```powershell
   firebase deploy --only functions
   ```

## Troubleshooting

- **Environment not loading**: Check `.env` file exists and is in functions directory
- **Production config missing**: Use `firebase functions:config:get` to verify
- **CORS errors**: Check `cors.origin` is set correctly for your domain
- **Database connection**: Verify `database.url` and `firestore.database_id` are correct