const { Schema, model } = require('mongoose');
const { NOTIFICATION_TYPE, NOTIFICATION_CHANNEL, NOTIFICATION_STATUS, NOTIFICATION_PRIORITY } = require('../Constants/enums');
const NotificationHooks = require('./Shared/User.hooks');

/**
 * User Notification Model
 * For in-app notifications shown in the UI (bell icon notifications)
 */
const userNotificationSchema = new Schema(
    {
        // Who receives the notification
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Who triggered the action (optional - some notifications are system-generated)
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        // Notification type
        type: {
            type: String,
            enum: Object.values(NOTIFICATION_TYPE),
            required: true,
        },

        // Notification headline
        title: {
            type: String,
            required: true,
            maxlength: 200,
        },

        // Notification body text
        message: {
            type: String,
            required: true,
            maxlength: 500,
        },

        // Icon identifier for UI
        icon: {
            type: String,
            enum: ['ticket', 'comment', 'user', 'alert', 'sla', 'system', 'success', 'warning', 'error'],
            default: 'ticket',
        },

        // Deep link for navigation
        actionUrl: {
            type: String,
        },

        // Resource references for linking
        resourceType: {
            type: String,
            enum: ['ticket', 'user', 'comment', 'group', 'organization', 'system'],
        },

        resourceId: {
            type: Schema.Types.ObjectId,
        },

        // Priority for sorting/display
        priority: {
            type: String,
            enum: ['low', 'normal', 'high', 'urgent'],
            default: 'normal',
        },

        // Read status
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        readAt: {
            type: Date,
        },

        // Archived (dismissed by user)
        isArchived: {
            type: Boolean,
            default: false,
        },

        // Organization scope
        organization_id: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
        },

        // Auto-expire old notifications (optional)
        expiresAt: {
            type: Date,
            index: { expires: 0 }, // TTL index
        },
    },
    {
        versionKey: false,
        timestamps: true,
        collection: 'User_Notifications',
    }
);


const indexes = [
    { userId: 1 },
    { 'email.enabled': 1 },
    { 'push.enabled': 1 },
    { 'inapp.enabled': 1 },
    { 'digest.enabled': 1, 'digest.frequency': 1 },
    { 'email.dailyDigest': 1 },
    { 'email.weeklyReport': 1 },
    { 'quietHours.enabled': 1 },
    { 'quietHours.timezone': 1 },
    { updatedAt: -1 },
];


NotificationHooks.createIndexes(userNotificationSchema, indexes);


const UserNotification = model('UserNotification', userNotificationSchema);

module.exports = UserNotification;
