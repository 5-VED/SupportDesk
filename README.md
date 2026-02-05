# SupportDesk - Enterprise Ticketing Platform

A modern, scalable customer support ticketing platform built with Nx monorepo architecture.

## 🏗️ Monorepo Structure

```
ZendeskClone/
├── apps/
│   ├── backend-api/          # Node.js/Express REST API
│   ├── frontend/             # React + Vite frontend
│   └── notification-service/ # TypeScript notification microservice
├── libs/
│   ├── shared/              # Common utilities, types, and enums
│   ├── ui-components/       # Shared React UI components
│   ├── api-client/          # API client and hooks
│   └── database-models/     # Shared database schemas
├── k8s/                     # Kubernetes deployment configs
├── docker/                  # Docker configurations
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ (recommended: v18 LTS or v20 LTS)
- npm v8+
- MongoDB (for backend-api)
- PostgreSQL (for notification-service)

### Installation

```bash
# Install all dependencies
npm install

# This will install dependencies for the workspace and all apps
```

## 📦 Available Commands

### Development

```bash
# Start frontend development server
npm run start:frontend

# Start backend API development server
npm run start:backend

# Start notification service development server
npm run start:notification
```

### Build

```bash
# Build all applications
npm run build

# Build specific app
npx nx build frontend
npx nx build backend-api
npx nx build notification-service
```

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
npx nx test backend-api
npx nx test frontend
```

### Linting

```bash
# Lint all projects
npm run lint

# Lint specific project
npx nx lint backend-api
```

### Nx Graph

```bash
# View dependency graph
npm run graph
```

## 🛠️ Nx Monorepo Benefits

- **Code Sharing**: Shared libraries eliminate code duplication
- **Type Safety**: TypeScript shared types across frontend and backend
- **Caching**: Nx caches builds and tests for faster development
- **Dependency Tracking**: Nx tracks dependencies between apps and libs
- **Consistent Tooling**: Unified ESLint, Prettier, and TypeScript configs

## 📚 Applications

### Frontend (`apps/frontend`)
- **Tech**: React 19, Vite 7, React Router
- **Port**: 5173 (dev)
- **Features**: Modern UI with dark mode, responsive design

### Backend API (`apps/backend-api`)
- **Tech**: Node.js, Express 5, MongoDB, Mongoose
- **Port**: 3000
- **Features**: RESTful API, JWT auth, rate limiting

### Notification Service (`apps/notification-service`)
- **Tech**: TypeScript, Node.js, PostgreSQL, Sequelize
- **Features**: Email, SMS, push notifications, queue processing

## 📖 Shared Libraries

### `@supportdesk/shared`
Common utilities, types, and enumerations used across all apps.

```typescript
import { TicketStatus, ITicket } from '@supportdesk/shared';
```

### `@supportdesk/ui-components`
Reusable React UI components.

```typescript
import { Button, Modal, Card } from '@supportdesk/ui-components';
```

### `@supportdesk/api-client`
Centralized API client with Axios and React hooks.

```typescript
import { ticketApi, authApi } from '@supportdesk/api-client';
```

## 🐳 Docker

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up

# Start specific service
docker-compose up frontend
```

## ☸️ Kubernetes

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/base/

# Deploy to specific environment
kubectl apply -k k8s/overlays/production/
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## 📄 License

[Add your license here]

## 🔗 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
