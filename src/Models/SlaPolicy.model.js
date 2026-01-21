const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');

const slaPolicySchema = new Schema(
    {
        title: {
            type: Schema.Types.String,
            required: true,
            trim: true,
        },
        position: {
            type: Number,
            default: 0
        },
        filter: {
            type: Map,
            of: Schema.Types.Mixed // e.g. { "priority": "high" }
        },
        policy_metrics: [{
            priority: String, // 'urgent'
            target: String, // 'first_reply_time'
            target_minutes: Number
        }],
        ...baseFieldsSchema.obj,
    },
    {
        collection: 'SlaPolicy_Master',
        timestamps: true,
    }
);

const SlaPolicy = model('SlaPolicy', slaPolicySchema);

module.exports = SlaPolicy;
