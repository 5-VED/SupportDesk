# Development Guide

## Prerequisites

- Node.js v16+ (recommended: v18 LTS or v20 LTS)
- npm v8+
- MongoDB running locally or accessible remotely
- PostgreSQL for notification service
- Redis for queue management

## Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd ZendeskClone

# Install all dependencies
npm install

# Set up environment variables for each app
cp apps/backend-api/.env.example apps/backend-api/.env
cp apps/notification-service/.env.example apps/notification-service/.env
```

## Running Applications

### Start All Services

```bash
# Terminal 1: Frontend
npm run start:frontend

# Terminal 2: Backend API
npm run start:backend

# Terminal 3: Notification Service
npm run start:notification
```

### Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Notification Service**: http://localhost:3001

## Common Development Tasks

### Creating a New Component

```bash
# In libs/ui-components
cd libs/ui-components/src/lib
mkdir NewComponent
touch NewComponent/NewComponent.jsx
touch NewComponent/NewComponent.css
```

### Adding a New API Endpoint

1. Create controller in `apps/backend-api/src/Controllers/`
2. Add route in `apps/backend-api/src/Router/`
3. Add validation in `apps/backend-api/src/Validators/`
4. Update Swagger documentation
5. Add corresponding function in `libs/api-client/src/lib/endpoints/`

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific app
npx nx test backend-api

# Run tests with coverage
npx nx test backend-api --coverage

# Run affected tests (only tests for changed code)
npx nx affected:test
```

### Linting and Formatting

```bash
# Lint all projects
npm run lint

# Format all files
npm run format

# Lint specific project
npx nx lint frontend
```

### Nx Commands

```bash
# View dependency graph
npm run graph

# Build all apps
npm run build

# Build affected apps only
npx nx affected:build

# Clear Nx cache
npx nx reset
```

## Debugging

### Frontend Debugging

Use React DevTools browser extension and Vite's built-in HMR.

### Backend Debugging

```bash
# Run with Node debugger
node --inspect apps/backend-api/src/server.js

# Use VS Code debugger with launch configuration
```

### TypeScript Debugging

```bash
# Compile TypeScript with watch mode
npx nx build notification-service --watch

# Or use ts-node for development
npx ts-node apps/notification-service/src/server.ts
```

## Environment Variables

### Backend API

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/supportdesk
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Notification Service

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/notifications
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## Troubleshooting

### Nx Cache Issues

```bash
# Clear Nx cache
npx nx reset
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <pid> /F
```

## Best Practices

1. **Keep libs small and focused**: Each library should have a single responsibility
2. **Use path aliases**: Import from `@supportdesk/shared` instead of relative paths
3. **Write tests**: Maintain test coverage above 80%
4. **Follow naming conventions**: Use PascalCase for components, camelCase for functions
5. **Document your code**: Add JSDoc comments for complex functions
6. **Commit often**: Make small, atomic commits with descriptive messages

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/ticket-filtering

# Make changes and commit
git add .
git commit -m "Add ticket filtering by status"

# Run tests and linting before pushing
npm test
npm run lint

# Push to remote
git push origin feature/ticket-filtering

# Create pull request on GitHub
```

## Performance Optimization

- Nx caching speeds up repeated builds and tests
- Only affected apps are rebuilt when changes are made
- Use `npx nx affected:build --parallel` for parallel builds
- Configure `.nxignore` to exclude large directories from Nx tracking
