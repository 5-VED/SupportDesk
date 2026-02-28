const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
            default: 'Folder',
        },
        color: {
            type: String,
            default: '#3b82f6',
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        organization_id: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            default: null,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model('Category', categorySchema);
