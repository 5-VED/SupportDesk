# Enterprise Ticket Management Service Plan

**Goal**: Build a scalable, enterprise-grade ticketing platform (Zendesk Clone) tailored for customer support, integrating seamlessly with the existing codebase architecture (MongoDB/Mongoose).

> [!NOTE]
> This plan adapts the user's initial request (which proposed PostgreSQL) to use **MongoDB/Mongoose** to strictly follow the "existing codebase architecture patterns" as requested.

## Architecture Overview

-   **Runtime**: Node.js
-   **Framework**: Express.js (Router/Controller pattern)
-   **Database**: MongoDB (via Mongoose ODM)
-   **Layered Architecture**:
    -   **Routes**: API endpoint definitions
    -   **Controllers**: Request handling, validation, response formatting
    -   **Services**: Core business logic, independent of HTTP
    -   **Repositories**: Database access layer (Clean query abstraction)
    -   **Models**: Mongoose Schemas

## Database Modeling (Mongoose)

We will introduce new models and enhance existing ones.

### 1. Organization (Multi-tenancy)
Represents a customer company.
```javascript
// Organization.model.js
{
  name: String,
  domains: [String], // e.g. ["google.com"] for auto-mapping users
  details: { type: Map, of: String }, // Flexible metadata
  settings: {
    allow_external_sharing: Boolean,
    default_locale: String
  },
  is_active: Boolean
}
```

### 2. User (Enhancement)
Update existing `User.model.js`.
-   **New Fields**:
    -   `organization_id`: ObjectId (Ref: Organization)
    -   `role_type`: Enum ['admin', 'agent', 'customer'] (Normalization of existing Role)
    -   `groups`: [ObjectId] (Ref: Group) - For Agents
    -   `tags`: [String] - For user segmentation

### 3. Group (Agent Groups)
Logic containers for agents (e.g., "Tier 1 Support", "Billing").
```javascript
// Group.model.js
{
  name: String,
  description: String,
  is_private: Boolean,
  organization_id: ObjectId // if groups are org-specific, usually global for the host instance
}
```

### 4. Ticket (Core Entity)
The central unit of work.
```javascript
// Ticket.model.js
{
  subject: String,
  description: String, // Initial content
  status: { type: String, enum: ['new', 'open', 'pending', 'hold', 'solved', 'closed'] },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'] },
  type: { type: String, enum: ['question', 'incident', 'problem', 'task'] },
  
  requester_id: { type: ObjectId, ref: 'User' },
  submitter_id: { type: ObjectId, ref: 'User' }, // Author if different from requester
  assignee_id: { type: ObjectId, ref: 'User' },
  group_id: { type: ObjectId, ref: 'Group' },
  organization_id: { type: ObjectId, ref: 'Organization' },
  
  tags: [String],
  custom_fields: [{ field_id: ObjectId, value: Schema.Types.Mixed }],
  
  // SLA & Metrics
  sla_policy_id: ObjectId, // Applied policy
  sla_breach_at: Date,
  first_response_at: Date,
  solved_at: Date,
  
  channel: String // 'email', 'api', 'web'
}
```

### 5. TicketComment (Conversations)
Stored in a separate collection for scalability (avoiding 16MB doc limit).
```javascript
// TicketComment.model.js
{
  ticket_id: { type: ObjectId, ref: 'Ticket', index: true },
  author_id: { type: ObjectId, ref: 'User' },
  body: String,
  html_body: String,
  public: Boolean, // True = Reply to customer, False = Internal Note
  attachments: [{ filename: String, url: String, mime_type: String }],
  metadata: Object // For email headers etc.
}
```

### 6. SlaPolicy (Business Logic)
Rules for SLA calculation.
```javascript
// SlaPolicy.model.js
{
  title: String,
  position: Number, // Execution order
  filter: Object, // Criteria (e.g. { priority: 'high', group_id: '...' })
  policy_metrics: [{
    priority: String, // 'urgent'
    target: String, // 'first_reply_time' or 'next_reply_time'
    target_minutes: Number // 60
  }]
}
```

---

## API Routes & Business Logic

### 1. Tickets API (`/api/v1/tickets`)
-   `POST /` - **Create Ticket**
    -   **Logic**:
        -   Validate input.
        -   Match `requester_email` to identifying `User` and `Organization`.
        -   Run **Triggers** (Auto-assign group, set priority).
        -   Apply **SLA Policy**.
        -   Emit `ticket.created` event.
-   `GET /` - **List Tickets** (Search/Views)
    -   **Logic**: Support complex filtering (Lucene-style query string or structured JSON queries). Pagination is mandatory.
-   `PUT /:id` - **Update Ticket**
    -   **Logic**:
        -   Check permissions (Enterprise RBAC).
        -   Handle concurrent updates (Optimistic locking via `__v`).
        -   Trigger logic (e.g., if status -> solved, check required fields).
-   `POST /:id/merge` - **Merge Ticket**
    -   **Logic**: Move comments from source to target, close source.

### 2. Ticket Comments API (`/api/v1/tickets/:id/comments`)
-   `POST /` - **Add Comment**
    -   **Logic**:
        -   If author is agent, allow `public: false` (Internal Note).
        -   If ticket was 'solved', reopen to 'open'.
        -   Notify participants (Requester + CCs).

### 3. Organizations API (`/api/v1/organizations`)
-   Standard CRUD.
-   `GET /:id/tickets` - View all tickets for an org.

### 4. Search API (`/api/v1/search`)
-   **Critical for Enterprise**:
    -   Implement full-text search (MongoDB Atlas Search or Regex if simple).
    -   Search tickets, users, and organizations unified.

---

## Advanced Business Logic Strategy

### SLA Service
-   **Calculation**: When a ticket is created/updated, find the first matching `SlaPolicy` by `position`.
-   **Target Setting**: Calculate `breach_at` time based on business hours (Calendar integration needed later).
-   **Monitoring**: Cron job checking for approaching breaches.

### Triggers & Automations
-   **Event Driven**: Using Node.js `EventEmitter` or internal Pub/Sub.
-   **Actions**: Send Email, Webhook, Modify Ticket (Set Group, Set Priority).

### Permissions
-   **Middleware**: `checkPermission('ticket.view')`.
-   **Scopes**:
    -   Admin: All access.
    -   Agent: Access to assigned groups + public tickets.
    -   Light Agent: Internal notes only.

## Verification Plan

### Automated Tests
-   **Unit Tests**: Jest tests for `SLA.service.ts` calculation logic.
-   **Integration Tests**: API (Supertest) flows:
    1.  Create Ticket -> Verify Default Status/Priority.
    2.  Agent Add Note -> Verify Private.
    3.  Customer Reply -> Verify Reopen.

### Manual Verification
1.  **Ticket Lifecycle**:
    -   Create ticket via POST.
    -   As Agent, fetch ticket list.
    -   Post a reply.
    -   Resolve ticket.
    -   Verify status changes in DB.
