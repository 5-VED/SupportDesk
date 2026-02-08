# Support Desk - API Documentation

Complete API reference for the Support Desk ticketing system.

**Base URL:** `http://localhost:3000/api`

---

## Table of Contents

- [Authentication](#authentication)
- [Tickets](#tickets)
- [Contacts](#contacts)
- [Agents](#agents)
- [Groups](#groups)
- [Organizations](#organizations)
- [Dashboard & Analytics](#dashboard--analytics)
- [Reports](#reports)
- [Knowledge Base](#knowledge-base)
- [Settings](#settings)
- [Tags](#tags)
- [File Upload](#file-upload)
- [Search](#search)
- [Notifications](#notifications)

---

## Authentication

### Login
```
POST /api/auth/login
```
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string"
    }
  }
}
```

---

### Signup
```
POST /api/auth/signup
```
Register a new user account.

**Flow:** User comes to platform --> User fills necessery details like user name , email , password , phonne , organization etc -> Then signup - > then user recieves a nofification on email --> User confirms the email -> on bprading process completed.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "organizationId": "string" // optional
}
```

---

### Logout
```
POST /api/auth/logout
```
Invalidate current session/token.

**Flow:** User requests logout --> System invalidates token (if applicable) --> User is logged out.

**Headers:** `Authorization: Bearer <token>`

---

### Forgot Password
```
POST /api/auth/forgot-password
```
Request password reset email.

**Flow:** User enters email --> System checks if email exists --> System generates reset token --> User receives email with reset link.

**Request Body:**
```json
{
  "email": "string"
}
```

---

### Reset Password
```
POST /api/auth/reset-password
```
Reset password using token from email.

**Flow:** User clicks email link & enters new password --> System validates token --> System updates password --> User can login with new password.

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

---

### Get Current User
```
GET /api/auth/me
```
Get authenticated user information.

**Flow:** User requests profile --> System verifies token --> System returns user details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "organizationId": "string"
  }
}
```

---

## Tickets

### List Tickets
```
GET /api/tickets
```
Get all tickets with filters and pagination.

**Flow:** User requests ticket list --> System checks permissions --> System retrieves tickets filtering by query params --> Returns list.

**Query Parameters:**
- `page` (number) - Page number, default: 1
- `limit` (number) - Results per page, default: 20
- `status` (string) - Filter by status: new, open, pending, hold, solved, closed
- `priority` (string) - Filter by priority: low, normal, high, urgent
- `assignee_id` (string) - Filter by assigned agent
- `group_id` (string) - Filter by group
- `search` (string) - Search in subject and description
- `sort` (string) - Sort field, default: created_at
- `order` (string) - Sort order: asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "string",
        "subject": "string",
        "description": "string",
        "status": "string",
        "priority": "string",
        "type": "string",
        "channel": "string",
        "requester_id": "string",
        "assignee_id": "string",
        "group_id": "string",
        "tags": ["string"],
        "created_at": "string",
        "updated_at": "string"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### Get Ticket Details
```
GET /api/tickets/:id
```
Get single ticket with full details.

**Flow:** User requests ticket ID --> System checks existence & permissions --> Returns ticket details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "subject": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "type": "string",
    "channel": "string",
    "requester": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "assignee": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "group": {
      "id": "string",
      "name": "string"
    },
    "tags": ["string"],
    "custom_fields": [],
    "created_at": "string",
    "updated_at": "string",
    "first_response_at": "string",
    "solved_at": "string"
  }
}
```

---

### Create Ticket
```
POST /api/tickets
```
Create a new support ticket.

**Flow:** User submits ticket form --> System validates data --> System creates ticket record --> System triggers notifications --> Returns created ticket.

**Request Body:**
```json
{
  "subject": "string",
  "description": "string",
  "priority": "low|normal|high|urgent",
  "type": "question|incident|problem|task",
  "assignee_id": "string", // optional
  "group_id": "string", // optional
  "tags": ["string"] // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "subject": "string",
    "status": "new",
    "created_at": "string"
  }
}
```

---

### Update Ticket
```
PUT /api/tickets/:id
```
Update ticket information.

**Flow:** User modifies ticket --> System validates & updates record --> Returns updated ticket.

**Request Body:**
```json
{
  "subject": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "type": "string",
  "assignee_id": "string",
  "group_id": "string",
  "tags": ["string"]
}
```

---

### Delete Ticket
```
DELETE /api/tickets/:id
```
Delete a ticket (soft delete).

**Flow:** User requests delete --> System checks permissions --> System performs soft delete --> Success response.

---

### Update Ticket Status
```
PATCH /api/tickets/:id/status
```
Update only the ticket status.

**Flow:** User updates status --> System applies change --> System logs activity --> Success response.

**Request Body:**
```json
{
  "status": "new|open|pending|hold|solved|closed"
}
```

---

### Update Ticket Priority
```
PATCH /api/tickets/:id/priority
```
Update only the ticket priority.

**Flow:** User updates priority --> System applies change --> System logs activity --> Success response.

**Request Body:**
```json
{
  "priority": "low|normal|high|urgent"
}
```

---

### Assign Ticket
```
PATCH /api/tickets/:id/assign
```
Assign ticket to agent or group.

**Flow:** User selects assignee/group --> System updates ticket assignment --> System notifies assignee --> Success response.

**Request Body:**
```json
{
  "assignee_id": "string", // optional
  "group_id": "string" // optional
}
```

---

### Add Comment
```
POST /api/tickets/:id/comments
```
Add a comment to a ticket.

**Flow:** User posts comment --> System validates input --> System attaches comment to ticket --> System triggers notifications --> Success response.

**Request Body:**
```json
{
  "body": "string",
  "public": true, // true for public, false for internal
  "attachments": [
    {
      "filename": "string",
      "url": "string",
      "mime_type": "string",
      "size": 1024
    }
  ]
}
```

---

### Get Ticket Comments
```
GET /api/tickets/:id/comments
```
Retrieve all comments for a ticket.

**Flow:** User views ticket --> System retrieves conversation history --> Returns chronological list of comments.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "ticket_id": "string",
      "author_id": "string",
      "author": {
        "name": "string",
        "email": "string"
      },
      "body": "string",
      "public": true,
      "attachments": [],
      "created_at": "string"
    }
  ]
}
```

---

### Get Ticket History
```
GET /api/tickets/:id/history
```
Get activity history/audit log for a ticket.

**Flow:** User requests history --> System retrieves audit logs --> Returns timeline of changes.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "ticket_id": "string",
      "user_id": "string",
      "user": {
        "name": "string"
      },
      "action": "string",
      "changes": {},
      "created_at": "string"
    }
  ]
}
```

---

### Bulk Update Tickets
```
POST /api/tickets/bulk-update
```
Update multiple tickets at once.

**Flow:** User selects multiple tickets & applies changes --> System updates all selected records --> Returns success status.

**Request Body:**
```json
{
  "ticket_ids": ["string"],
  "updates": {
    "status": "string",
    "priority": "string",
    "assignee_id": "string",
    "group_id": "string"
  }
}
```

---

### Bulk Delete Tickets
```
DELETE /api/tickets/bulk-delete
```
Delete multiple tickets.

**Flow:** User selects multiple tickets for deletion --> System soft deletes all selected records --> Returns success status.

**Request Body:**
```json
{
  "ticket_ids": ["string"]
}
```

---

## Contacts

### List Contacts
```
GET /api/contacts
```
Get all contacts/customers.

**Flow:** User requests contacts list --> System retrieves contacts with pagination --> Returns list.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Results per page
- `search` (string) - Search by name, email, company

**Response:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "role": "string",
        "tickets_count": 5,
        "created_at": "string"
      }
    ],
    "pagination": {}
  }
}
```

---

### Get Contact Details
```
GET /api/contacts/:id
```
Get single contact with full information.

**Flow:** User requests particular contact --> System fetches details --> Returns contact info.

---

### Create Contact
```
POST /api/contacts
```
Create a new contact.

**Flow:** User enters contact details --> System validates & saves contact --> Returns created contact.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "role": "string",
  "organization_id": "string"
}
```

---

### Update Contact
```
PUT /api/contacts/:id
```
Update contact information.

**Flow:** User modifies contact details --> System updates record --> Returns updated contact.

---

### Delete Contact
```
DELETE /api/contacts/:id
```
Delete a contact.

**Flow:** User requests deletion --> System removes contact record --> Returns success.

---

### Get Contact Tickets
```
GET /api/contacts/:id/tickets
```
Get all tickets for a specific contact.

**Flow:** User View's contact's tickets --> System queries tickets linked to contact --> Returns ticket list.

---

### Get Contact Activity
```
GET /api/contacts/:id/activity
```
Get activity timeline for a contact.

**Flow:** User requests contact activity --> System retrieves interaction history --> Returns timeline.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "action": "string",
      "description": "string",
      "created_at": "string"
    }
  ]
}
```

---

## Agents

### List Agents
```
GET /api/agents
```
Get all support agents.

**Flow:** Admin requests agent list --> System retrieves agents with status --> Returns list.

**Query Parameters:**
- `status` (string) - Filter by status: online, busy, away, offline
- `department` (string) - Filter by department
- `search` (string) - Search by name, email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "department": "string",
      "status": "online",
      "tickets": {
        "open": 12,
        "resolved": 156,
        "total": 168
      },
      "rating": 4.8,
      "sla_compliance": 96
    }
  ]
}
```

---

### Get Agent Details
```
GET /api/agents/:id
```
Get single agent with detailed information.

**Flow:** Admin requests agent details --> System fetches profile & metrics --> Returns details.

---

### Create Agent
```
POST /api/agents
```
Create a new agent account.

**Flow:** Admin enters agent details & role --> System creates account --> System sends invitation email --> Returns created agent.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "agent|senior_agent|team_lead",
  "department": "string",
  "groups": ["string"]
}
```

---

### Update Agent
```
PUT /api/agents/:id
```
Update agent information.

**Flow:** Admin modifies agent details --> System updates record --> Returns updated info.

---

### Delete Agent
```
DELETE /api/agents/:id
```
Delete/deactivate an agent.

**Flow:** Admin deactivates agent --> System updates status to inactive --> Agent loses access.

---

### Update Agent Status
```
PATCH /api/agents/:id/status
```
Update agent availability status.

**Flow:** Agent changes status (e.g. online/away) --> System updates availability --> Returns new status.

**Request Body:**
```json
{
  "status": "online|busy|away|offline"
}
```

---

### Get Agent Tickets
```
GET /api/agents/:id/tickets
```
Get tickets assigned to a specific agent.

**Flow:** Viewer requests assigned tickets --> System filters tickets by assignee --> Returns list.

---

### Get Agent Performance
```
GET /api/agents/:id/performance
```
Get performance metrics for an agent.

**Flow:** Admin requests performance stats --> System calculates metrics (resolution time, etc.) --> Returns report.

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets_resolved": 156,
    "avg_resolution_time": "4h 23m",
    "first_response_time": "12m",
    "customer_satisfaction": 4.8,
    "sla_compliance": 96
  }
}
```

---

## Groups

### List Groups
```
GET /api/groups
```
Get all support groups/teams.

**Flow:** User requests groups --> System retrieves groups list --> Returns list.

---

### Get Group Details
```
GET /api/groups/:id
```
Get single group with members and details.

**Flow:** User requests group info --> System fetches details & member list --> Returns data.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "members": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    ],
    "created_at": "string"
  }
}
```

---

### Create Group
```
POST /api/groups
```
Create a new group.

**Flow:** Admin names group & adds members --> System creates group entity --> Returns new group.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "member_ids": ["string"]
}
```

---

### Update Group
```
PUT /api/groups/:id
```
Update group information.

**Flow:** Admin modifies group name/desc --> System updates record --> Returns updated group.

---

### Delete Group
```
DELETE /api/groups/:id
```
Delete a group.

**Flow:** Admin requests deletion --> System removes group --> Returns success.

---

### Add Group Member
```
POST /api/groups/:id/members
```
Add an agent to a group.

**Flow:** Admin adds user to group --> System updates membership --> Returns success.

**Request Body:**
```json
{
  "user_id": "string"
}
```

---

### Remove Group Member
```
DELETE /api/groups/:id/members/:userId
```
Remove an agent from a group.

**Flow:** Admin removes user from group --> System updates membership --> Returns success.

---

## Organizations

### List Organizations
```
GET /api/organizations
```
Get all organizations.

**Flow:** Admin requests organizations --> System retrieves list --> Returns list.

---

### Get Organization Details
```
GET /api/organizations/:id
```
Get single organization details.

**Flow:** User requests org info --> System fetches details --> Returns data.

---

### Create Organization
```
POST /api/organizations
```
Create a new organization.

**Flow:** Admin enters org details --> System creates organization --> Returns new org.

**Request Body:**
```json
{
  "name": "string",
  "domain": "string",
  "settings": {}
}
```

---

### Update Organization
```
PUT /api/organizations/:id
```
Update organization information.

**Flow:** Admin modifies org details --> System updates record --> Returns updated org.

---

### Delete Organization
```
DELETE /api/organizations/:id
```
Delete an organization.

**Flow:** Admin requests deletion --> System removes organization --> Returns success.

---

## Dashboard & Analytics

### Get Dashboard Statistics
```
GET /api/dashboard/stats
```
Get overview statistics for the dashboard.

**Flow:** User loads dashboard --> System aggregates real-time stats (open/pending/resolved tickets) --> Returns unified view.

**Response:**
```json
{
  "success": true,
  "data": {
    "open_tickets": 145,
    "pending_tickets": 23,
    "overdue_tickets": 8,
    "resolved_today": 67,
    "total_tickets": 1234
  }
}
```

---

### Get Recent Activity
```
GET /api/dashboard/activity
```
Get recent activity feed.

**Flow:** User views feed --> System queries latest events --> Returns activity stream.

**Query Parameters:**
- `limit` (number) - Number of activities to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "ticket_created|ticket_updated|comment_added",
      "user": {
        "name": "string"
      },
      "action": "string",
      "target": "string",
      "timestamp": "string"
    }
  ]
}
```

---

### Get SLA Status
```
GET /api/dashboard/sla-status
```
Get SLA compliance metrics.

**Flow:** User requests SLA status --> System calculates adherence percentages --> Returns metrics.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "label": "First Response",
      "value": 94,
      "target": 95
    },
    {
      "label": "Resolution Time",
      "value": 87,
      "target": 90
    },
    {
      "label": "Customer Satisfaction",
      "value": 92,
      "target": 85
    }
  ]
}
```

---

## Reports

### Get Ticket Reports
```
GET /api/reports/tickets
```
Get ticket analytics and metrics.

**Flow:** Admin selects date range --> System aggregates ticket data --> Returns charts/stats.

**Query Parameters:**
- `start_date` (string) - Start date (ISO format)
- `end_date` (string) - End date (ISO format)
- `group_by` (string) - Group by: day, week, month

**Response:**
```json
{
  "success": true,
  "data": {
    "total_tickets": 1234,
    "by_status": {
      "open": 145,
      "pending": 23,
      "resolved": 890
    },
    "by_priority": {
      "urgent": 12,
      "high": 45,
      "normal": 890,
      "low": 287
    },
    "trend": []
  }
}
```

---

### Get Agent Reports
```
GET /api/reports/agents
```
Get agent performance reports.

**Flow:** Admin requests agent report --> System compiles individual agent stats --> Returns report.

---

### Get Satisfaction Reports
```
GET /api/reports/satisfaction
```
Get customer satisfaction metrics.

**Flow:** Admin requests satisfaction scores --> System averages feedback ratings --> Returns score.

---

### Get SLA Reports
```
GET /api/reports/sla
```
Get SLA compliance reports.

**Flow:** Admin requests SLA report --> System calculates breach vs compliance --> Returns report.

---

### Export Reports
```
GET /api/reports/export
```
Export reports in various formats.

**Flow:** User selects report type & format --> System generates file (CSV/PDF) --> Returns download link.

**Query Parameters:**
- `type` (string) - Report type
- `format` (string) - Export format: csv, pdf, xlsx
- `start_date` (string)
- `end_date` (string)

---

## Knowledge Base

### List Articles
```
GET /api/kb/articles
```
Get knowledge base articles.

**Flow:** User searches/browses KB --> System queries articles with filters --> Returns list.

**Query Parameters:**
- `category` (string) - Filter by category
- `search` (string) - Search articles
- `limit` (number)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "category": "string",
      "author": {
        "name": "string"
      },
      "views": 123,
      "helpful_votes": 45,
      "created_at": "string"
    }
  ]
}
```

---

### Get Article Details
```
GET /api/kb/articles/:id
```
Get single article with full content.

**Flow:** User clicks article --> System retrieves full text & meta --> Returns article.

---

### Create Article
```
POST /api/kb/articles
```
Create a new knowledge base article.

**Flow:** Author writes article --> System saves & indexes content --> Returns created article.

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"],
  "published": true
}
```

---

### Update Article
```
PUT /api/kb/articles/:id
```
Update article content.

**Flow:** Author edits article --> System updates content --> Returns updated article.

---

### Delete Article
```
DELETE /api/kb/articles/:id
```
Delete an article.

**Flow:** Author deletes article --> System removes record --> Returns success.

---

### Get Categories
```
GET /api/kb/categories
```
Get all article categories.

**Flow:** User selects category filter --> System lists available categories --> Returns list.

---

### Vote on Article
```
POST /api/kb/articles/:id/vote
```
Vote if article was helpful.

**Flow:** User votes on article --> System updates helpful count --> Returns success.

**Request Body:**
```json
{
  "helpful": true
}
```

---

## Settings

### Get Settings
```
GET /api/settings
```
Get user or organization settings.

**Flow:** User requests settings --> System returns configuration --> Returns settings object.

---

### Update Profile
```
PUT /api/settings/profile
```
Update user profile.

**Flow:** User updates profile form --> System saves changes --> Returns updated profile.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "avatar": "string"
}
```

---

### Update Notifications
```
PUT /api/settings/notifications
```
Update notification preferences.

**Flow:** User toggles notification options --> System updates preferences --> Returns success.

**Request Body:**
```json
{
  "email_notifications": true,
  "desktop_notifications": true,
  "ticket_updates": true,
  "ticket_assignments": true,
  "mentions": true
}
```

---

### Update Security
```
PUT /api/settings/security
```
Update security settings.

**Flow:** User changes password/2FA --> System verifies & updates security config --> Returns success.

**Request Body:**
```json
{
  "current_password": "string",
  "new_password": "string",
  "two_factor_enabled": true
}
```

---

### Update Organization Settings
```
PUT /api/settings/organization
```
Update organization-wide settings (admin only).

**Flow:** Admin changes org details --> System updates org config --> Returns success.

---

## Tags

### List Tags
```
GET /api/tags
```
Get all available tags.

**Flow:** User requests tags --> System retrieves list --> Returns tags.

---

### Create Tag
```
POST /api/tags
```
Create a new tag.

**Flow:** Admin defines tag --> System creates tag entity --> Returns new tag.

**Request Body:**
```json
{
  "name": "string",
  "color": "string"
}
```

---

### Delete Tag
```
DELETE /api/tags/:id
```
Delete a tag.

**Flow:** Admin removes tag --> System deletes entity --> Returns success.

---

## File Upload

### Upload File
```
POST /api/upload
```
Upload a file attachment.

**Flow:** User selects file --> System validates type/size --> System uploads to storage --> Returns file URL.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with file field

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "filename": "string",
    "url": "string",
    "mime_type": "string",
    "size": 1024,
    "uploaded_at": "string"
  }
}
```

---

### Download File
```
GET /api/uploads/:id
```
Download or view an uploaded file.

**Flow:** User requests file --> System generates access URL/Stream --> Returns content.

---

### Delete File
```
DELETE /api/uploads/:id
```
Delete an uploaded file.

**Flow:** User requests deletion --> System removes file from storage --> Returns success.

---

## Search

### Global Search
```
GET /api/search
```
Search across all entities.

**Flow:** User enters global query --> System searches tickets/contacts/articles --> Returns combined results.

**Query Parameters:**
- `q` (string) - Search query
- `types` (string) - Comma-separated types: tickets,contacts,articles

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [],
    "contacts": [],
    "articles": []
  }
}
```

---

### Search Tickets
```
GET /api/search/tickets
```
Search tickets only.

**Flow:** User searches tickets --> System filters tickets by keyword --> Returns matches.

**Query Parameters:**
- `q` (string) - Search query

---

### Search Contacts
```
GET /api/search/contacts
```
Search contacts only.

**Flow:** User searches contacts --> System filters contacts by name/email --> Returns matches.

**Query Parameters:**
- `q` (string) - Search query

---

## Notifications

### Get Notifications
```
GET /api/notifications
```
Get user notifications.

**Flow:** User checks notifications --> System retrieves unread/recent alerts --> Returns list.

**Query Parameters:**
- `unread` (boolean) - Filter unread only
- `limit` (number)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "ticket_assigned|ticket_updated|mention",
      "title": "string",
      "message": "string",
      "read": false,
      "link": "string",
      "created_at": "string"
    }
  ]
}
```

---

### Mark Notification as Read
```
PATCH /api/notifications/:id/read
```
Mark a single notification as read.

**Flow:** User clicks notification --> System updates read status --> Returns success.

---

### Mark All as Read
```
PATCH /api/notifications/read-all
```
Mark all notifications as read.

**Flow:** User clicks 'Read All' --> System updates all user alerts --> Returns success.

---

### Delete Notification
```
DELETE /api/notifications/:id
```
Delete a notification.

**Flow:** User removes notification --> System deletes record --> Returns success.

---

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

---

## Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

---

## Pagination

List endpoints support pagination with these query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Paginated responses include:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Rate Limiting

API requests are rate limited:
- **Authenticated users:** 1000 requests per hour
- **Unauthenticated requests:** 100 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## Versioning

The API uses URL versioning. Current version is `v1`:

```
/api/v1/tickets
```

---

## WebSocket Events

For real-time updates, connect to WebSocket endpoint:

```
ws://localhost:3000/ws
```

**Events:**
- `ticket.created`
- `ticket.updated`
- `ticket.assigned`
- `comment.added`
- `notification.new`

---

**Last Updated:** 2026-02-05
**Version:** 1.0.0
