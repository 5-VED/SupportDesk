# Entity Relationship Diagram (ERD)

This document outlines the data models and their relationships within the OrbitDesk application.

```mermaid
erDiagram
    BaseFields {
        boolean is_deleted
        boolean is_active
    }

    Organization {
        ObjectId _id
        string name
        string[] domains
        Map details
        Map settings
        boolean is_active
        boolean is_deleted
    }

    User {
        ObjectId _id
        string first_name
        string last_name
        string email
        string password
        string phone
        ObjectId role_idFK
        ObjectId organization_idFK
        string role_type
        string department
        ObjectId[] group_idsFK
        string[] tags
        string address
        string gender
        string profile_pic
        string country_code
        string status
        date last_activee_at
        string devicee_token    
        boolean is_authorized_rider
        string confirmation_code
        boolean is_deleted
        boolean is_active
    }

    Role {
        ObjectId _id
        string role
        boolean is_deleted
        boolean is_active
    }

    Group {
        ObjectId _id
        string name
        string description
        boolean is_private
        ObjectId organization_idFK
        boolean is_deleted
        boolean is_active
    }

    Category {
        ObjectId _id
        string name
        string description
        string icon
        string color
        string slug
        number order
        ObjectId organization_idFK
        boolean is_active
    }

    Ticket {
        ObjectId _id
        string subject
        string description
        string status
        string priority
        string type
        string channel
        ObjectId requester_idFK
        ObjectId submitter_idFK
        ObjectId assignee_idFK
        ObjectId group_idFK
        ObjectId organization_idFK
        string[] tags
        Object[] custom_fields
        ObjectId sla_policy_idFK
        date sla_breach_at
        date response_due_at
        date resolve_due_at
        date first_response_at
        date solved_at
        boolean is_deleted
        boolean is_active
    }

    TicketComment {
        ObjectId _id
        ObjectId ticket_idFK
        ObjectId author_idFK
        string body
        string html_body
        boolean public
        string visibility
        Object[] attachments
        Map metadata
        boolean is_deleted
        boolean is_active
    }

    Attachment {
        ObjectId _id
        string file_name
        string file_type
        string file_size
        string file_url
        date uploaded_at
        boolean is_deleted
        boolean is_active
    }

    SlaPolicy {
        ObjectId _id
        string title
        number position
        Map filter
        Object[] policy_metrics
        boolean is_deleted
        boolean is_active
    }

    Notification {
        ObjectId _id
        ObjectId recipient_idFK
        string notification_type
        ObjectId sender_idFK
        ObjectId conversation_idFK
        ObjectId message_idFK
        string content
    }

    NotificationPreferences {
        ObjectId _id
        ObjectId userIdFK
        Object email
        Object push
        Object inapp
        Object quietHours
        Object digest
    }

    UserNotification {
        ObjectId _id
        ObjectId recipient_idFK
        ObjectId sender_idFK
        string type
        string title
        string message
        string icon
        string actionUrl
        string resourceType
        ObjectId resourceId
        string priority
        boolean isRead
        date readAt
        boolean isArchived
        ObjectId organization_idFK
        date expiresAt
    }

    UserAgent {
        ObjectId _id
        ObjectId user_idFK
        Object browser
        Object os
        Object device
        string source
        date last_login
        boolean is_current
        boolean is_deleted
        boolean is_active
    }

    %% Relationships
    Organization ||--o{ User : "has members"
    Organization ||--o{ Group : "owns"
    Organization ||--o{ Category : "defines"
    Organization ||--o{ Ticket : "contains"
    Organization ||--o{ UserNotification : "scopes"

    Role ||--o{ User : "assigned to"

    Group ||--o{ Ticket : "assigned to"
    Group }|--|{ User : "contains members"

    User ||--o{ Ticket : "requests"
    User ||--o{ Ticket : "submits"
    User ||--o{ Ticket : "assigned"
    User ||--o{ TicketComment : "authors"
    User ||--o{ Notification : "receives"
    User ||--o{ Notification : "sends"
    User ||--o{ UserNotification : "receives"
    User ||--o{ UserNotification : "triggers"
    User ||--|| NotificationPreferences : "configures"
    User ||--o{ UserAgent : "uses"

    Ticket ||--o{ TicketComment : "has"
    Ticket ||--o{ SlaPolicy : "governed by"

    TicketComment ||--o{ Attachment : "can have"
```

## Model Descriptions

- **Organization**: The top-level entity representing a company or tenant.
- **User**: Represents all actors in the system (Admins, Agents, Customers).
- **Role**: Defines the permissions and role type for a user (e.g., Admin, Agent).
- **Group**: A collection of users (e.g., "Support Team", "Sales").
- **Ticket**: The core unit of work, representing a support request.
- **TicketComment**: Updates and communication threads within a ticket.
- **SlaPolicy**: Service Level Agreement policies that determine ticket due dates.
- **Category**: Classification for tickets or knowledge base articles (though KB wasn't scanned, Category is generic).
- **Notification**: System-level notifications (likely mainly email/backend triggers).
- **UserNotification**: In-app notifications for users.
- **NotificationPreferences**: User-specific settings for how they want to be notified.
- **UserAgent**: Tracks devices and browsers used by users for security and auditing.
