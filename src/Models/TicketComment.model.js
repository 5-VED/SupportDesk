const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');
const { COMMENT_VISIBILITY } = require('../Constants/enums');

const ticketCommentSchema = new Schema(
    {
        ticket_id: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
            index: true,
        },
        author_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        body: {
            type: Schema.Types.String,
            required: true,
        },
        html_body: {
            type: Schema.Types.String,
            default: '',
        },
        public: {
            type: Schema.Types.Boolean,
            default: true,
        },
        visibility: {
            type: Schema.Types.String,
            enum: Object.values(COMMENT_VISIBILITY),
            default: COMMENT_VISIBILITY.PUBLIC
        },
        attachments: [{
            filename: String,
            url: String,
            mime_type: String,
            size: Number
        }],
        metadata: {
            type: Map,
            of: String
        },
        ...baseFieldsSchema.obj,
    },
    {
        collection: 'TicketComment_Master',
        timestamps: true,
    }
);

const TicketComment = model('TicketComment', ticketCommentSchema);

module.exports = TicketComment;
