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

**Headers:** `Authorization: Bearer <token>`

---

### Forgot Password
```
POST /api/auth/forgot-password
```
Request password reset email.

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

---

### Update Ticket Status
```
PATCH /api/tickets/:id/status
```
Update only the ticket status.

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

---

### Create Contact
```
POST /api/contacts
```
Create a new contact.

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

---

### Delete Contact
```
DELETE /api/contacts/:id
```
Delete a contact.

---

### Get Contact Tickets
```
GET /api/contacts/:id/tickets
```
Get all tickets for a specific contact.

---

### Get Contact Activity
```
GET /api/contacts/:id/activity
```
Get activity timeline for a contact.

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

---

### Create Agent
```
POST /api/agents
```
Create a new agent account.

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

---

### Delete Agent
```
DELETE /api/agents/:id
```
Delete/deactivate an agent.

---

### Update Agent Status
```
PATCH /api/agents/:id/status
```
Update agent availability status.

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

---

### Get Agent Performance
```
GET /api/agents/:id/performance
```
Get performance metrics for an agent.

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

---

### Get Group Details
```
GET /api/groups/:id
```
Get single group with members and details.

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

---

### Delete Group
```
DELETE /api/groups/:id
```
Delete a group.

---

### Add Group Member
```
POST /api/groups/:id/members
```
Add an agent to a group.

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

---

## Organizations

### List Organizations
```
GET /api/organizations
```
Get all organizations.

---

### Get Organization Details
```
GET /api/organizations/:id
```
Get single organization details.

---

### Create Organization
```
POST /api/organizations
```
Create a new organization.

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

---

### Delete Organization
```
DELETE /api/organizations/:id
```
Delete an organization.

---

## Dashboard & Analytics

### Get Dashboard Statistics
```
GET /api/dashboard/stats
```
Get overview statistics for the dashboard.

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

---

### Get Satisfaction Reports
```
GET /api/reports/satisfaction
```
Get customer satisfaction metrics.

---

### Get SLA Reports
```
GET /api/reports/sla
```
Get SLA compliance reports.

---

### Export Reports
```
GET /api/reports/export
```
Export reports in various formats.

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

---

### Create Article
```
POST /api/kb/articles
```
Create a new knowledge base article.

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

---

### Delete Article
```
DELETE /api/kb/articles/:id
```
Delete an article.

---

### Get Categories
```
GET /api/kb/categories
```
Get all article categories.

---

### Vote on Article
```
POST /api/kb/articles/:id/vote
```
Vote if article was helpful.

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

---

### Update Profile
```
PUT /api/settings/profile
```
Update user profile.

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

---

## Tags

### List Tags
```
GET /api/tags
```
Get all available tags.

---

### Create Tag
```
POST /api/tags
```
Create a new tag.

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

---

## File Upload

### Upload File
```
POST /api/upload
```
Upload a file attachment.

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

---

### Delete File
```
DELETE /api/uploads/:id
```
Delete an uploaded file.

---

## Search

### Global Search
```
GET /api/search
```
Search across all entities.

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

**Query Parameters:**
- `q` (string) - Search query

---

### Search Contacts
```
GET /api/search/contacts
```
Search contacts only.

**Query Parameters:**
- `q` (string) - Search query

---

## Notifications

### Get Notifications
```
GET /api/notifications
```
Get user notifications.

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

---

### Mark All as Read
```
PATCH /api/notifications/read-all
```
Mark all notifications as read.

---

### Delete Notification
```
DELETE /api/notifications/:id
```
Delete a notification.

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
