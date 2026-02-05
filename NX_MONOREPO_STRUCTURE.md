# Nx Monorepo Folder Structure - SupportDesk

This document outlines the proposed folder structure for converting the SupportDesk project into an Nx monorepo.

```
ZendeskClone/
├── .github/                          # GitHub workflows and CI/CD
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .vscode/                          # VS Code workspace settings
│   ├── extensions.json
│   └── settings.json
│
├── apps/                             # Applications directory
│   ├── frontend/                     # React frontend application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── AppShell.jsx
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   ├── PageContainer.jsx
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   └── Topbar.jsx
│   │   │   │   └── ui/
│   │   │   │       ├── Avatar.jsx
│   │   │   │       ├── Badge.jsx
│   │   │   │       ├── Button.jsx
│   │   │   │       ├── Card.jsx
│   │   │   │       ├── DataTable.jsx
│   │   │   │       ├── Input.jsx
│   │   │   │       ├── Modal.jsx
│   │   │   │       └── ThemeToggle.jsx
│   │   │   ├── pages/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   ├── Signup.jsx
│   │   │   │   │   └── ForgotPassword.jsx
│   │   │   │   ├── Agents.jsx
│   │   │   │   ├── Contacts.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── KnowledgeBase.jsx
│   │   │   │   ├── NewTicketModal.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   ├── TicketDetail.jsx
│   │   │   │   └── TicketsList.jsx
│   │   │   ├── context/
│   │   │   │   └── ThemeContext.jsx
│   │   │   ├── styles/
│   │   │   │   ├── index.css
│   │   │   │   └── App.css
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── public/
│   │   │   └── favicon.ico
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── package.json
│   │   ├── project.json              # Nx project configuration
│   │   ├── tsconfig.app.json
│   │   └── .eslintrc.json
│   │
│   ├── backend-api/                  # Node.js/Express backend API
│   │   ├── src/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth.controller.js
│   │   │   │   ├── Group.controller.js
│   │   │   │   ├── Organization.controller.js
│   │   │   │   ├── Ticket.controller.js
│   │   │   │   └── User.controller.js
│   │   │   ├── Models/
│   │   │   │   ├── Group.model.js
│   │   │   │   ├── Organization.model.js
│   │   │   │   ├── SlaPolicy.model.js
│   │   │   │   ├── Ticket.model.js
│   │   │   │   ├── TicketComment.model.js
│   │   │   │   ├── User.model.js
│   │   │   │   └── BaseFields.model.js
│   │   │   ├── Router/
│   │   │   │   ├── Auth.routes.js
│   │   │   │   ├── Group.routes.js
│   │   │   │   ├── Organization.routes.js
│   │   │   │   ├── Ticket.routes.js
│   │   │   │   ├── User.routes.js
│   │   │   │   └── index.js
│   │   │   ├── Validators/
│   │   │   │   ├── Auth.validator.js
│   │   │   │   ├── Ticket.validator.js
│   │   │   │   └── User.validator.js
│   │   │   ├── Middleware/
│   │   │   │   ├── auth.middleware.js
│   │   │   │   ├── errorHandler.middleware.js
│   │   │   │   └── validation.middleware.js
│   │   │   ├── Services/
│   │   │   │   ├── Auth.service.js
│   │   │   │   ├── Ticket.service.js
│   │   │   │   └── User.service.js
│   │   │   ├── Database/
│   │   │   │   └── MongoConnection.js
│   │   │   ├── Constants/
│   │   │   │   └── enums.js
│   │   │   ├── Utils/
│   │   │   │   ├── logger.js
│   │   │   │   └── helpers.js
│   │   │   ├── Config/
│   │   │   │   └── index.js
│   │   │   ├── server.js
│   │   │   └── app.js
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── package.json
│   │   ├── project.json              # Nx project configuration
│   │   ├── jest.config.js
│   │   └── .env.example
│   │
│   └── notification-service/         # TypeScript notification microservice
│       ├── src/
│       │   ├── Common/
│       │   │   ├── RoutesConfig.ts
│       │   │   ├── ResponseTypes.ts
│       │   │   └── ErrorHandler.ts
│       │   ├── Controllers/
│       │   │   ├── Email.controller.ts
│       │   │   ├── SMS.controller.ts
│       │   │   └── Push.controller.ts
│       │   ├── Services/
│       │   │   ├── Email.service.ts
│       │   │   ├── SMS.service.ts
│       │   │   └── Push.service.ts
│       │   ├── Routes/
│       │   │   └── index.ts
│       │   ├── Models/
│       │   │   └── Notification.model.ts
│       │   ├── Config/
│       │   │   └── index.ts
│       │   ├── Database/
│       │   │   └── sequelize.ts
│       │   ├── Middlewares/
│       │   │   ├── auth.middleware.ts
│       │   │   └── validation.middleware.ts
│       │   ├── Utils/
│       │   │   └── logger.ts
│       │   ├── generated/            # Protocol buffer types
│       │   │   ├── events/
│       │   │   └── services/
│       │   ├── server.ts
│       │   └── app.ts
│       ├── protos/                   # Protocol buffer definitions
│       │   ├── events/
│       │   └── services/
│       ├── dist/                     # Compiled TypeScript output
│       ├── package.json
│       ├── project.json              # Nx project configuration
│       ├── tsconfig.json
│       ├── tsconfig.app.json
│       ├── nodemon.json
│       └── .env.example
│
├── libs/                             # Shared libraries
│   ├── shared/                       # Shared utilities and types
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── types/
│   │   │   │   │   ├── user.types.ts
│   │   │   │   │   ├── ticket.types.ts
│   │   │   │   │   └── common.types.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── validators.ts
│   │   │   │   │   ├── formatters.ts
│   │   │   │   │   └── constants.ts
│   │   │   │   └── enums/
│   │   │   │       └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── project.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.lib.json
│   │
│   ├── ui-components/                # Shared React UI components
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Card/
│   │   │   │   └── Avatar/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── api-client/                   # API client library
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── axios-instance.ts
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── tickets.ts
│   │   │   │   │   ├── auth.ts
│   │   │   │   │   ├── users.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── hooks/
│   │   │   │       ├── useTickets.ts
│   │   │   │       ├── useAuth.ts
│   │   │   │       └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   └── database-models/              # Shared database models
│       ├── src/
│       │   ├── lib/
│       │   │   ├── schemas/
│       │   │   │   ├── user.schema.ts
│       │   │   │   ├── ticket.schema.ts
│       │   │   │   └── index.ts
│       │   │   └── interfaces/
│       │   │       └── index.ts
│       │   └── index.ts
│       ├── package.json
│       ├── project.json
│       └── tsconfig.json
│
├── tools/                            # Custom Nx generators and scripts
│   ├── generators/
│   │   ├── api-endpoint/
│   │   └── component/
│   └── scripts/
│       ├── migrate-db.sh
│       └── seed-data.sh
│
├── k8s/                              # Kubernetes configurations
│   ├── base/
│   │   ├── frontend-deployment.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── notification-deployment.yaml
│   │   ├── mongodb-statefulset.yaml
│   │   ├── redis-deployment.yaml
│   │   └── ingress.yaml
│   ├── overlays/
│   │   ├── development/
│   │   ├── staging/
│   │   └── production/
│   └── kustomization.yaml
│
├── docker/                           # Docker configurations
│   ├── frontend/
│   │   └── Dockerfile
│   ├── backend/
│   │   └── Dockerfile
│   ├── notification-service/
│   │   └── Dockerfile
│   └── docker-compose.yml
│
├── docs/                             # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── guides/
│       ├── getting-started.md
│       ├── development.md
│       └── testing.md
│
├── .nx/                              # Nx cache directory
│   └── cache/
│
├── dist/                             # Build output directory
│   ├── apps/
│   │   ├── frontend/
│   │   ├── backend-api/
│   │   └── notification-service/
│   └── libs/
│
├── node_modules/                     # Node modules (workspace root)
│
├── .gitignore                        # Git ignore rules
├── .prettierrc                       # Prettier configuration
├── .prettierignore                   # Prettier ignore rules
├── .eslintrc.json                    # ESLint configuration (root)
├── jest.config.ts                    # Jest configuration (root)
├── jest.preset.js                    # Jest preset
├── nx.json                           # Nx workspace configuration
├── package.json                      # Root package.json (workspace)
├── pack                           # License file
└── CHANGELOG.md   age-lock.json                 # Lock file
├── tsconfig.base.json                # Base TypeScript configuration
├── README.md                         # Project README
├── LICENSE                   # Changelog

```

---

## Key Directory Explanations

### `/apps` - Applications
Contains all deployable applications:
- **frontend**: React/Vite SPA for the UI
- **backend-api**: Node.js/Express REST API
- **notification-service**: TypeScript microservice for notifications

### `/libs` - Shared Libraries
Reusable code shared across applications:
- **shared**: Common types, utilities, enums, validators
- **ui-components**: Reusable React components
- **api-client**: Centralized API communication logic
- **database-models**: Shared database schemas and interfaces

### `/tools` - Tooling
Custom Nx generators and utility scripts for development

### `/k8s` - Kubernetes
All Kubernetes manifests for deployment

### `/docker` - Docker
Dockerfiles and docker-compose configuration

### `/docs` - Documentation
Project documentation including API docs, architecture, guides

---

## Benefits of This Structure

1. **Code Sharing**: Shared libraries eliminate code duplication
2. **Type Safety**: TypeScript shared types across frontend and backend
3. **Independent Deployment**: Each app can be built and deployed separately
4. **Dependency Graph**: Nx tracks dependencies between apps/libs
5. **Caching**: Nx caches builds and tests for faster CI/CD
6. **Consistency**: Standardized project structure and tooling
7. **Scalability**: Easy to add new apps or microservices
8. **Monorepo Benefits**: Single source of truth, atomic commits, unified versioning

---

## Migration Notes

**Current Structure:**
```
ZendeskClone/
├── Backend/           → apps/backend-api/
├── FrontEnd/          → apps/frontend/
├── Notification-Serive/ → apps/notification-service/
├── K8s/               → k8s/
└── API_DOCUMENTATION.md → docs/API_DOCUMENTATION.md
```

**What Will Change:**
- All apps move to `/apps` directory
- Shared code extracted to `/libs`
- Single root `package.json` with workspaces
- Nx configuration files added (`nx.json`, `project.json` in each app)
- Unified TypeScript configuration
- Centralized tooling and scripts

**What Stays the Same:**
- Source code structure within each app
- Individual app `package.json` dependencies
- Environment configurations
- Docker and K8s configurations (with minor path updates)

---

**Created:** 2026-02-05  
**Version:** 1.0.0
