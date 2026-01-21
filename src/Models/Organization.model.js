const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');

const organizationSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            trim: true,
        },
        domains: [{
            type: Schema.Types.String,
            trim: true
        }],
        details: {
            type: Map,
            of: String
        },
        settings: {
            allow_external_sharing: { type: Boolean, default: false },
            default_locale: { type: String, default: 'en-US' }
        },
        is_active: {
            type: Schema.Types.Boolean,
            default: true
        },
        ...baseFieldsSchema.obj,
    },
    {
        collection: 'Organization_Master',
        timestamps: true,
    }
);

const Organization = model('Organization', organizationSchema);

module.exports = Organization;
