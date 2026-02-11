/**
 * Notification Service
 * Handles publishing notification events to Kafka for the Notification-Service to consume
 */

const { kafkaProducer } = require('../Config/Kafka/Producer');
const { KAFKA_TOPICS, NOTIFICATION_TYPE } = require('../Constants/enums');

/**
 * Publish ticket created event
 * @param {Object} ticket - The created ticket
 * @param {Object} requester - The user who created the ticket
 * @param {Object} assignee - The assigned agent (optional)
 */
const publishTicketCreated = async (ticket, requester, assignee = null) => {
    const payload = {
        event_type: NOTIFICATION_TYPE.TICKET_CREATED,
        ticket_id: ticket._id.toString(),
        ticket_subject: ticket.subject,
        ticket_priority: ticket.priority,
        ticket_status: ticket.status,
        requester: {
            id: requester._id?.toString() || requester.id,
            email: requester.email,
            name: requester.name,
        },
        assignee: assignee ? {
            id: assignee._id?.toString() || assignee.id,
            email: assignee.email,
            name: assignee.name,
        } : null,
        organization_id: ticket.organization_id?.toString(),
        created_at: ticket.createdAt || new Date().toISOString(),
    };

    console.log("----- ticket  creation payload ----->", payload)

    await kafkaProducer(KAFKA_TOPICS.TICKET_CREATED, 0, payload);
    console.log(`📢 Published ticket-created event for ticket: ${ticket._id}`);
};

/**
 * Publish ticket assigned event
 * @param {Object} ticket - The ticket being assigned
 * @param {Object} assignee - The agent being assigned
 * @param {Object} assignedBy - The user who performed the assignment
 */
const publishTicketAssigned = async (ticket, assignee, assignedBy) => {
    const payload = {
        event_type: NOTIFICATION_TYPE.TICKET_ASSIGNED,
        ticket_id: ticket._id.toString(),
        ticket_subject: ticket.subject,
        ticket_priority: ticket.priority,
        assignee: {
            id: assignee._id?.toString() || assignee.id,
            email: assignee.email,
            name: assignee.name,
        },
        assigned_by: {
            id: assignedBy._id?.toString() || assignedBy.id,
            email: assignedBy.email,
            name: assignedBy.name,
        },
        ticket_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket._id}`,
        assigned_at: new Date().toISOString(),
    };

    await kafkaProducer(KAFKA_TOPICS.TICKET_ASSIGNED, 0, payload);
    console.log(`📢 Published ticket-assigned event for ticket: ${ticket._id}`);
};

/**
 * Publish ticket commented event
 * @param {Object} ticket - The ticket that was commented on
 * @param {Object} comment - The comment details
 * @param {Object} author - The comment author
 * @param {Array} recipients - Users who should be notified
 */
const publishTicketCommented = async (ticket, comment, author, recipients = []) => {
    const payload = {
        event_type: NOTIFICATION_TYPE.TICKET_COMMENTED,
        ticket_id: ticket._id.toString(),
        ticket_subject: ticket.subject,
        comment_id: comment._id.toString(),
        comment_body: comment.body.substring(0, 200), // Preview only
        is_public: comment.public,
        author: {
            id: author._id?.toString() || author.id,
            email: author.email,
            name: author.name,
        },
        recipients: recipients.map(r => ({
            id: r._id?.toString() || r.id,
            email: r.email,
            name: r.name,
        })),
        ticket_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket._id}`,
        commented_at: comment.createdAt || new Date().toISOString(),
    };

    await kafkaProducer(KAFKA_TOPICS.TICKET_COMMENTED, 0, payload);
    console.log(`📢 Published ticket-commented event for ticket: ${ticket._id}`);
};

/**
 * Publish ticket status changed event
 * @param {Object} ticket - The ticket
 * @param {String} oldStatus - Previous status
 * @param {String} newStatus - New status
 * @param {Object} changedBy - User who changed the status
 */
const publishTicketStatusChanged = async (ticket, oldStatus, newStatus, changedBy) => {
    const payload = {
        event_type: NOTIFICATION_TYPE.TICKET_STATUS_CHANGED,
        ticket_id: ticket._id.toString(),
        ticket_subject: ticket.subject,
        old_status: oldStatus,
        new_status: newStatus,
        changed_by: {
            id: changedBy._id?.toString() || changedBy.id,
            email: changedBy.email,
            name: changedBy.name,
        },
        requester_email: ticket.requester_id?.email || null,
        assignee_email: ticket.assignee_id?.email || null,
        ticket_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket._id}`,
        changed_at: new Date().toISOString(),
    };

    await kafkaProducer(KAFKA_TOPICS.TICKET_STATUS_CHANGED, 0, payload);
    console.log(`📢 Published ticket-status-changed event for ticket: ${ticket._id}`);
};



/**
 * Publish SLA warning event
 * @param {Object} ticket - The ticket approaching SLA breach
 * @param {Object} slaPolicy - The SLA policy details
 * @param {Number} minutesRemaining - Minutes until breach
 */
const publishSlaWarning = async (ticket, slaPolicy, minutesRemaining) => {
    const payload = {
        event_type: NOTIFICATION_TYPE.SLA_WARNING,
        ticket_id: ticket._id.toString(),
        ticket_subject: ticket.subject,
        ticket_priority: ticket.priority,
        sla_policy: slaPolicy?.name || 'Default',
        minutes_remaining: minutesRemaining,
        assignee_email: ticket.assignee_id?.email || null,
        ticket_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket._id}`,
        warning_at: new Date().toISOString(),
    };

    await kafkaProducer(KAFKA_TOPICS.SLA_WARNING, 0, payload);
    console.log(`⚠️ Published SLA warning for ticket: ${ticket._id}`);
};

/**
 * Publish SLA breach event
 * @param {Object} ticket - The ticket that breached SLA
 * @param {Object} slaPolicy - The SLA policy details
 */
const publishSlaBreach = async (ticket, slaPolicy) => {
    const payload = {
        event_type: NOTIFICATION_TYPE.SLA_BREACH,
        ticket_id: ticket._id.toString(),
        ticket_subject: ticket.subject,
        ticket_priority: ticket.priority,
        sla_policy: slaPolicy?.name || 'Default',
        assignee_email: ticket.assignee_id?.email || null,
        ticket_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket._id}`,
        breached_at: new Date().toISOString(),
    };

    await kafkaProducer(KAFKA_TOPICS.SLA_BREACH, 0, payload);
    console.log(`🚨 Published SLA breach for ticket: ${ticket._id}`);
};

module.exports = {
    publishTicketCreated,
    publishTicketAssigned,
    publishTicketCommented,
    publishTicketStatusChanged,

    publishSlaWarning,
    publishSlaBreach,
};
