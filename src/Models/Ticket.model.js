const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');
const {
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_TYPE,
  TICKET_CHANNEL,
} = require('../Constants/enums');

const ticketSchema = new Schema(
  {
    subject: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.NEW,
    },
    priority: {
      type: Schema.Types.String,
      enum: Object.values(TICKET_PRIORITY),
      default: TICKET_PRIORITY.NORMAL,
    },
    type: {
      type: Schema.Types.String,
      enum: Object.values(TICKET_TYPE),
      default: TICKET_TYPE.QUESTION,
    },
    channel: {
      type: Schema.Types.String,
      enum: Object.values(TICKET_CHANNEL),
      default: TICKET_CHANNEL.EMAIL,
    },
    requester_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submitter_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignee_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    organization_id: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    tags: [
      {
        type: Schema.Types.String,
        trim: true,
      },
    ],
    custom_fields: [
      {
        field_id: Schema.Types.ObjectId,
        value: Schema.Types.Mixed,
      },
    ],
    sla_policy_id: {
      type: Schema.Types.ObjectId,
      ref: 'SlaPolicy',
      default: null,
    },
    sla_breach_at: {
      type: Schema.Types.Date,
      default: null,
    },
    first_response_at: {
      type: Schema.Types.Date,
      default: null,
    },
    solved_at: {
      type: Schema.Types.Date,
      default: null,
    },
    ...baseFieldsSchema.obj,
  },
  {
    collection: 'Ticket_Master',
    timestamps: true,
  }
);

const Ticket = model('Ticket', ticketSchema);

module.exports = Ticket;
