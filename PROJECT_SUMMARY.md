# 🛰️ OrbitDesk — Project Summary

> **An enterprise-grade, AI-ready customer support platform inspired by Zendesk/Zoho Desk.**

---

## 📌 Overview

OrbitDesk is a full-stack, multi-service helpdesk application designed to manage customer support tickets, contacts, organizations, and agent workflows. It follows a **microservices architecture** with three independently running services, event-driven communication via **Apache Kafka**, and a modern **React** single-page application as the frontend.

---

## 🏗️ High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     FrontEnd (React + Vite)               │
│         SPA  •  React Router  •  Lucide Icons             │
│         Recharts  •  Dark/Light Theme  •  Axios           │
└────────────────────────┬─────────────────────────────────┘
                         │  REST API (HTTP)
                         ▼
┌──────────────────────────────────────────────────────────┐
│             Backend (Node.js + Express 5)                 │
│   Routes → Controllers → Services → Repositories         │
│   MongoDB (Mongoose) • JWT Auth • Joi Validation          │
│   Socket.IO • Winston Logger • Swagger Docs               │
│   Kafka Producer  ──────────────────────┐                 │
└─────────────────────────────────────────┼────────────────┘
                                          │  Kafka Events
                                          ▼
┌──────────────────────────────────────────────────────────┐
│        Notification Service (Node.js + TypeScript)        │
│   Kafka Consumer • Orchestrator • Nodemailer              │
│   Email Templates • MongoDB • Redis                       │
└──────────────────────────────────────────────────────────┘
```

### Infrastructure (Docker Compose)

| Service       | Image / Runtime           | Port  |
|---------------|---------------------------|-------|
| Backend API   | Node.js (Express 5)       | 5000  |
| MongoDB       | `mongo:latest`            | 27017 |
| Zookeeper     | Confluent 7.3.0           | 2181  |
| Kafka         | Confluent 7.3.0           | 9092  |

A **K8s** directory exists (currently empty) — Kubernetes deployment is planned for production.

---

## 🧩 Service Breakdown

### 1. 🖥️ FrontEnd — `FrontEnd/`

| Attribute       | Details                                                   |
|-----------------|-----------------------------------------------------------|
| **Framework**   | React 19 + Vite 7                                         |
| **Routing**     | React Router DOM v7                                       |
| **Styling**     | Vanilla CSS (Zoho Desk-style with Zerodha Kite minimal theme) |
| **Icons**       | Lucide React                                              |
| **Charts**      | Recharts                                                  |
| **HTTP Client** | Axios                                                     |
| **Toasts**      | React Hot Toast                                           |
| **Exports**     | xlsx (Excel export)                                       |
| **Theming**     | Dark / Light mode toggle                                  |

#### Pages

| Page               | File(s)                          | Description                                 |
|--------------------|----------------------------------|---------------------------------------------|
| **Login**          | `auth/Login.jsx`                 | Email + password authentication             |
| **Signup**         | `auth/Signup.jsx`                | New user registration                       |
| **Forgot Password**| `auth/ForgotPassword.jsx`        | Password reset request                      |
| **Dashboard**      | `Dashboard.jsx`                  | KPI cards, charts, ticket overview          |
| **Tickets List**   | `TicketsList.jsx`                | Filterable, paginated ticket table with bulk actions |
| **Ticket Detail**  | `TicketDetail.jsx`               | Full ticket view, comments, status changes  |
| **New Ticket**     | `NewTicketModal.jsx`             | Modal for creating tickets                  |
| **Contacts**       | `Contacts.jsx`, `ContactModal.jsx` | Customer contact management with bulk delete |
| **Organizations**  | `Organizations.jsx`, `OrganizationModal.jsx` | Multi-tenant organization management |
| **Groups**         | `Groups.jsx`, `GroupModal.jsx`   | Agent group/team management                 |
| **Agents**         | `Agents.jsx`                     | Support agent directory                     |
| **Reports**        | `Reports.jsx`                    | Analytics and reporting                     |
| **Knowledge Base** | `KnowledgeBase.jsx`              | Help articles (planned)                     |
| **Settings**       | `Settings.jsx`                   | App configuration                           |
| **Profile**        | `Profile.jsx`                    | User profile management                     |

#### Reusable UI Components

`Avatar`, `Badge`, `Button`, `Card`, `DataTable`, `Input`, `Loader`, `Modal`, `ThemeToggle`

#### Layout Components

`Sidebar`, `TopNavbar`, `PageContainer`

#### Frontend Services

`auth.service.js` · `ticket.service.js` · `user.service.js` · `group.service.js` · `organization.service.js`

---

### 2. ⚙️ Backend — `Backend/`

| Attribute          | Details                                        |
|--------------------|------------------------------------------------|
| **Runtime**        | Node.js                                        |
| **Framework**      | Express 5                                      |
| **Database**       | MongoDB via Mongoose 8                         |
| **Auth**           | JWT (jsonwebtoken) + bcrypt                    |
| **Validation**     | Joi                                            |
| **Message Broker** | KafkaJS (producer)                             |
| **Real-time**      | Socket.IO                                      |
| **Logging**        | Winston + Daily Rotate File                    |
| **API Docs**       | Swagger (swagger-jsdoc + swagger-ui-express)   |
| **File Upload**    | Multer                                         |
| **Rate Limiting**  | express-rate-limit                             |
| **Testing**        | Jest + Supertest                               |
| **Caching**        | ioredis (Redis)                                |

#### Architecture Pattern: **Service-Repository**

```
Routes  →  Controllers  →  Services  →  Repositories  →  Models (Mongoose)
```

#### Data Models

| Model                       | Description                                      |
|-----------------------------|--------------------------------------------------|
| **User**                    | Users with roles (admin, agent, customer), org membership, group assignments |
| **Organization**            | Multi-tenant companies with domains & settings    |
| **Group**                   | Agent teams (e.g., "Billing", "Tier 1 Support")  |
| **Ticket**                  | Core entity: subject, description, status, priority, type, SLA tracking |
| **TicketComment**           | Conversation thread per ticket (public replies & internal notes) |
| **Role**                    | Role definitions for RBAC                        |
| **SlaPolicy**               | SLA rules with priority-based targets            |
| **Notification**            | System notification records                      |
| **NotificationPreferences** | Per-user notification channel preferences        |
| **UserNotification**        | User-specific notification instances              |
| **UserAgent**               | Browser/device tracking for sessions             |
| **Attachments**             | File attachment metadata                         |

#### API Modules (Routes)

| Route File              | Base Path            | Key Endpoints                                   |
|-------------------------|----------------------|-------------------------------------------------|
| `User.routes.js`        | `/api/users`         | CRUD, auth (login/signup/logout), password reset, bulk delete |
| `Ticket.routes.js`      | `/api/tickets`       | CRUD, status/priority update, assign, comments, history, bulk ops |
| `Organization.routes.js`| `/api/organizations` | CRUD                                            |
| `Group.routes.js`       | `/api/groups`        | CRUD                                            |
| `Role.routes.js`        | `/api/roles`         | CRUD                                            |

#### Middlewares

| Middleware                | Purpose                           |
|---------------------------|-----------------------------------|
| `Auth.middleware.js`      | JWT token verification            |
| `Validlidator.middleware.js` | Joi schema validation          |
| `rateLimiter.middleware.js`  | API rate limiting              |
| `File.middleware.js`      | Multer file upload handling       |
| `Excel.middleware.js`     | Excel export processing           |
| `UserAgent.middleware.js` | Device/browser tracking           |

---

### 3. 📬 Notification Service — `Notification-Serive/`

| Attribute        | Details                                        |
|------------------|------------------------------------------------|
| **Language**     | TypeScript                                     |
| **Framework**    | Express 4                                      |
| **Database**     | MongoDB (Mongoose 9)                           |
| **Message Broker** | KafkaJS (consumer)                           |
| **Email**        | Nodemailer                                     |
| **Caching**      | Redis (ioredis)                                |
| **Security**     | Helmet, HPP, CORS                              |

#### Internal Architecture

```
Kafka Consumer  →  Orchestrator  →  Channel Adapters (Email)  →  Templates
```

| Component        | Description                                       |
|------------------|---------------------------------------------------|
| **Orchestrator** | Routes Kafka events to appropriate channel handlers |
| **Channels**     | `email.adapter.ts` — Nodemailer integration        |
| **Templates**    | `templates.ts` — HTML email templates for signup, ticket events, etc. |
| **Worker**       | Background queue processing                        |
| **Queues**       | Job queue management                               |

#### Kafka Topics Consumed

- `user-signup` — Welcome email on registration
- Ticket-related events (created, assigned, commented, etc.)

---

## 🔑 Key Features (Implemented)

| Feature                        | Status |
|--------------------------------|--------|
| ✅ User Authentication (JWT)   | Done   |
| ✅ Multi-tenant Organizations  | Done   |
| ✅ Ticket CRUD + Lifecycle     | Done   |
| ✅ Ticket Comments (public/internal) | Done |
| ✅ Agent Groups & Assignment   | Done   |
| ✅ Contact Management          | Done   |
| ✅ Bulk Delete (Tickets & Contacts) | Done |
| ✅ Dynamic Pagination          | Done   |
| ✅ SLA Policy Model            | Done   |
| ✅ Kafka Event-Driven Notifications | Done |
| ✅ Email Notifications (Signup, Ticket Events) | Done |
| ✅ Dark / Light Theme Toggle   | Done   |
| ✅ Dashboard with Charts       | Done   |
| ✅ Reports Page                | Done   |
| ✅ Rate Limiting & Security    | Done   |
| ✅ Swagger API Documentation   | Done   |
| ✅ Duplicate Contact Prevention | Done  |
| ✅ Docker Compose (Dev)        | Done   |

---

## 🚀 Planned Features (Roadmap)

### AI Integration (Documented in `AI_INTEGRATION_PLAN.md`)

| Phase | Features                                         | Status   |
|-------|--------------------------------------------------|----------|
| 1     | Smart Reply Suggestions (multi-model AI adapter) | Planned  |
| 2     | Ticket Summarization + Sentiment Analysis        | Planned  |
| 3     | Auto-Categorization, Tagging + Similar Tickets   | Planned  |
| 4     | KB Article Generator + Customer Chatbot          | Planned  |

### Automation

| Feature                | Description                             |
|------------------------|-----------------------------------------|
| Workflow Rule Engine   | "If This Then That" for ticket events   |
| SLA Timer & Escalation | Auto-track response/resolution times    |
| Email-to-Ticket        | Inbound email creates tickets           |
| CSAT Surveys           | Post-resolution satisfaction surveys    |
| Scheduled Reports      | Daily digest, weekly reports            |
| Auto-Close/Reopen      | Stale ticket management                 |

### Infrastructure

- Kubernetes deployment (K8s directory ready)
- Production CI/CD pipeline

---

## 📂 Project Structure

```
OrbitDesk/
├── FrontEnd/                    # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/          # Reusable UI (Avatar, Badge, Modal, etc.)
│   │   │   ├── auth/            # Auth guard
│   │   │   ├── layout/          # Sidebar, TopNavbar, PageContainer
│   │   │   └── ui/              # Design system components
│   │   ├── pages/               # Dashboard, Tickets, Contacts, etc.
│   │   │   └── auth/            # Login, Signup, ForgotPassword
│   │   ├── services/            # API service layer (Axios)
│   │   ├── context/             # React Context (Auth, Theme)
│   │   └── utils/               # Helper utilities
│   └── package.json
│
├── Backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── Config/              # App configuration
│   │   ├── Constants/           # Enums & constants
│   │   ├── Controllers/         # Request handlers
│   │   ├── Database/            # DB connection setup
│   │   ├── Documentation/       # Swagger setup
│   │   ├── Filters/             # Query filters
│   │   ├── Middlewares/         # Auth, validation, rate limiting
│   │   ├── Models/              # Mongoose schemas (14 models)
│   │   ├── Repository/          # Data access layer
│   │   ├── Router/              # API route definitions
│   │   ├── Services/            # Business logic layer
│   │   ├── Utils/               # Helpers (logger, etc.)
│   │   └── Validators/          # Joi validation schemas
│   ├── tests/                   # Jest + Supertest
│   ├── Dockerfile
│   └── docker-compose.yaml      # MongoDB + Kafka + Zookeeper
│
├── Notification-Serive/         # TypeScript notification microservice
│   ├── src/
│   │   ├── Channels/            # Email adapter (Nodemailer)
│   │   ├── Config/              # Kafka, Redis, DB config
│   │   ├── Models/              # Notification models
│   │   ├── Orchestrator/        # Event routing logic
│   │   ├── Templates/           # HTML email templates
│   │   ├── Worker/              # Background job processing
│   │   └── Queues/              # Job queue management
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── K8s/                         # Kubernetes manifests (planned)
├── API_DOCUMENTATION.md         # Full API reference
├── AI_INTEGRATION_PLAN.md       # AI features roadmap
└── PROJECT_SUMMARY.md           # ← This file
```

---

## 🧰 Tech Stack At a Glance

| Layer              | Technology                                              |
|--------------------|---------------------------------------------------------|
| **Frontend**       | React 19, Vite 7, React Router 7, Recharts, Lucide     |
| **Backend API**    | Node.js, Express 5, Mongoose 8, Joi, JWT, Socket.IO    |
| **Notifications**  | TypeScript, Express 4, Nodemailer, Mongoose 9           |
| **Database**       | MongoDB                                                 |
| **Message Broker** | Apache Kafka (KafkaJS)                                  |
| **Cache**          | Redis (ioredis)                                         |
| **DevOps**         | Docker, Docker Compose, Kubernetes (planned)            |
| **Testing**        | Jest, Supertest, Faker.js                               |
| **Logging**        | Winston + Daily Rotate File                             |
| **API Docs**       | Swagger UI                                              |

---

*Last updated: February 11, 2026*
