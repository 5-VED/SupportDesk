const { Schema, model } = require('mongoose');
const NotificatioPreferencenHooks = require('./Shared/User.hooks');

/**
 * Notification Preferences Model
 * Allows users to control which notifications they receive on each channel
 */
const notificationPreferencesSchema = new Schema(
    {
        // User these preferences belong to
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        // Email notification settings
        email: {
            enabled: { type: Boolean, default: true },
            ticketCreated: { type: Boolean, default: true },
            ticketAssigned: { type: Boolean, default: true },
            ticketCommented: { type: Boolean, default: true },
            ticketStatusChanged: { type: Boolean, default: true },
            ticketResolved: { type: Boolean, default: true },
            slaWarning: { type: Boolean, default: true },
            slaBreach: { type: Boolean, default: true },
            dailyDigest: { type: Boolean, default: false },
            weeklyReport: { type: Boolean, default: false },
        },

        // Push notification settings
        push: {
            enabled: { type: Boolean, default: true },
            ticketAssigned: { type: Boolean, default: true },
            ticketCommented: { type: Boolean, default: true },
            urgentOnly: { type: Boolean, default: false },
            slaWarning: { type: Boolean, default: true },
        },

        // In-app notification settings
        inapp: {
            enabled: { type: Boolean, default: true },
            showToast: { type: Boolean, default: true },
            playSound: { type: Boolean, default: true },
        },

        // Quiet hours (Do Not Disturb)
        quietHours: {
            enabled: { type: Boolean, default: false },
            start: { type: String, default: '22:00' }, // HH:mm format
            end: { type: String, default: '08:00' },
            timezone: { type: String, default: 'UTC' },
            weekendsOnly: { type: Boolean, default: false },
        },

        // Digest preferences
        digest: {
            enabled: { type: Boolean, default: false },
            frequency: {
                type: String,
                enum: ['daily', 'weekly', 'never'],
                default: 'never'
            },
            sendAt: { type: String, default: '09:00' }, // HH:mm format
        },
    },
    {
        versionKey: false,
        timestamps: true,
        collection: 'Notification_Preferences',
    }
);

const indexes = [
    // One preference document per user
    { userId: 1 },

    // Channel enablement lookups
    { 'email.enabled': 1 },
    { 'push.enabled': 1 },
    { 'inapp.enabled': 1 },

    // Email event-based filtering (when sending emails)
    { 'email.ticketCreated': 1 },
    { 'email.ticketAssigned': 1 },
    { 'email.ticketCommented': 1 },
    { 'email.ticketStatusChanged': 1 },
    { 'email.ticketResolved': 1 },
    { 'email.slaWarning': 1 },
    { 'email.slaBreach': 1 },

    // Push notification filtering
    { 'push.ticketAssigned': 1 },
    { 'push.ticketCommented': 1 },
    { 'push.slaWarning': 1 },
    { 'push.urgentOnly': 1 },

    // Digest / scheduled jobs
    { 'digest.enabled': 1, 'digest.frequency': 1 },
    { 'email.dailyDigest': 1 },
    { 'email.weeklyReport': 1 },

    // Quiet hours / Do Not Disturb
    { 'quietHours.enabled': 1 },
    { 'quietHours.timezone': 1 },

    // Operational queries
    { createdAt: -1 },
    { updatedAt: -1 },
];


// Index for quick lookups
NotificatioPreferencenHooks.createIndexes(notificationPreferencesSchema, indexes);


const NotificationPreferences = model('NotificationPreferences', notificationPreferencesSchema);

module.exports = NotificationPreferences;
