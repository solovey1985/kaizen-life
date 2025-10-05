# KaizenLife

Monorepo for the KaizenLife MVP - A habit & goal-tracking app built with TypeScript, Angular, and Firebase.

## Table of Contents

- [KaizenLife](#kaizenlife)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Documentation](#documentation)
    - [Component Documentation](#component-documentation)
    - [Quick Reference](#quick-reference)
    - [Developer Resources](#developer-resources)
  - [Project Overview](#project-overview)
    - [Tech Stack](#tech-stack)
  - [Repository Structure](#repository-structure)
  - [Development Commands](#development-commands)
  - [Getting Started](#getting-started)
  - [Contributing](#contributing)
  - [Support](#support)
    - [Documentation First](#documentation-first)
    - [Getting Help](#getting-help)
    - [Quick Troubleshooting](#quick-troubleshooting)

## Quick Start

```powershell
# Install dependencies
npm install

# Start emulators with data persistence
.\start-emulators.ps1

# Access the app at http://localhost:5000
```

## Documentation

- **[📚 Emulators Guide](EMULATORS.md)** - Complete guide for running, updating, and working with Firebase emulators
- **[📋 Documentation Index](docs/README.md)** - Complete index of all project documentation
- **[🏗️ Project Structure](docs/project-structure.md)** - Repository layout and architecture (coming soon)
- **[🔧 Development Guide](docs/development.md)** - Development workflow and best practices (coming soon)

### Component Documentation

- **[🎨 Styles Architecture](apps/web/kaizen-web/src/styles/README.md)** - CSS/SCSS architecture and design system
- **[🔧 Data Services](apps/web/kaizen-web/src/app/services/README.md)** - Angular services architecture with signals
- **[📱 Angular App](apps/web/kaizen-web/README.md)** - Angular application setup and development
- **[✅ Shared Validators](packages/shared/src/validators/README.md)** - Zod schemas for type-safe validation

### Quick Reference

| Documentation | Purpose | Target Audience |
|---------------|---------|-----------------|
| [EMULATORS.md](EMULATORS.md) | Firebase emulator setup and usage | All developers |
| [Styles README](apps/web/kaizen-web/src/styles/README.md) | CSS architecture and design patterns | Frontend developers |
| [Services README](apps/web/kaizen-web/src/app/services/README.md) | Angular services and data management | Frontend developers |
| [Validators README](packages/shared/src/validators/README.md) | Shared validation schemas | All developers |
| [Angular README](apps/web/kaizen-web/README.md) | Angular CLI commands and setup | Frontend developers |

### Developer Resources

- **[🤖 Copilot Instructions](.github/copilot-instructions.md)** - AI assistant context and project guidelines

## Project Overview

KaizenLife is a habit & goal-tracking MVP where users earn two credit types:
- **KP (Productivity Credits)** - Earned through productivity actions
- **KZ (Health Credits)** - Earned through health actions

### Tech Stack
- **Frontend**: Angular (TypeScript)
- **Backend**: Firebase Functions (TypeScript)  
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting

## Repository Structure

```
kaizen-life/
├── apps/
│   ├── web/kaizen-web/     # Angular frontend app
│   └── functions/          # Firebase Functions (API)
├── packages/
│   └── shared/            # Shared TypeScript types and validators
├── functions/             # Legacy functions (to be removed)
├── EMULATORS.md          # Firebase emulators guide
└── start-emulators.ps1   # Quick start script
```

## Development Commands

```powershell
# Build everything
npm run build:all

# Start functions emulator only
npm run start:functions

# Build Angular app
cd apps/web/kaizen-web && npm run build

# Build functions
cd functions && npm run build
```

## Getting Started

1. **Prerequisites**: Node.js, Firebase CLI, Java 11+, Angular CLI
2. **Setup**: `npm install` at repo root
3. **Start**: `.\start-emulators.ps1`
4. **Access**: Open http://localhost:5000

For detailed instructions, see the [Emulators Guide](EMULATORS.md).

## Contributing

1. Follow the monorepo structure
2. Use shared types from `packages/shared`
3. Test with Firebase emulators
4. Keep data persistence between emulator sessions
5. Update relevant README files when adding features

For specific development guidelines, see:
- [Data Services Architecture](apps/web/kaizen-web/src/app/services/README.md) for Angular patterns
- [Styles Architecture](apps/web/kaizen-web/src/styles/README.md) for CSS/SCSS guidelines
- [Shared Validators](packages/shared/src/validators/README.md) for validation patterns

## Support

### Documentation First
Check these resources in order:

1. **[EMULATORS.md](EMULATORS.md)** - For emulator setup and troubleshooting
2. **[Component READMEs](#component-documentation)** - For specific architecture questions
3. **[Angular README](apps/web/kaizen-web/README.md)** - For Angular CLI and build issues
4. **[Copilot Instructions](.github/copilot-instructions.md)** - For project context and guidelines

### Getting Help

- 🔍 **Search existing issues** in the GitHub repository
- 📚 **Check Firebase documentation** for API questions  
- 🐛 **Create GitHub issues** for project-specific problems
- 💬 **Review code comments** in the relevant README files

### Quick Troubleshooting

```powershell
# Diagnose common issues
.\troubleshoot-emulators.ps1

# Reset emulator data
Remove-Item -Recurse ../kaizen-life-emulator-data

# Rebuild everything
npm run build:all
```
