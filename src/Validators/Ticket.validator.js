const Joi = require('joi');
const { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS } = require('../Constants/enums');

const createTicketSchema = Joi.object({
  subject: Joi.string().required().messages({
    'any.required': 'Subject is required',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
  }),
  priority: Joi.string().valid(...Object.values(TICKET_PRIORITY)),
  type: Joi.string().valid(...Object.values(TICKET_TYPE)),
  status: Joi.string().valid(...Object.values(TICKET_STATUS)),
  group_id: Joi.string().hex().length(24),
  assignee_id: Joi.string().hex().length(24),
  tags: Joi.array().items(Joi.string()),
});

const updateTicketSchema = Joi.object({
  subject: Joi.string(),
  description: Joi.string(),
  status: Joi.string().valid(...Object.values(TICKET_STATUS)),
  priority: Joi.string().valid(...Object.values(TICKET_PRIORITY)),
  type: Joi.string().valid(...Object.values(TICKET_TYPE)),
  group_id: Joi.string().hex().length(24),
  assignee_id: Joi.string().hex().length(24),
  tags: Joi.array().items(Joi.string()),
});

const addCommentSchema = Joi.object({
  body: Joi.string().required().messages({
    'any.required': 'Comment body is required',
  }),
  public: Joi.boolean().default(true),
  attachments: Joi.array().items(
    Joi.object({
      filename: Joi.string(),
      url: Joi.string(),
      mime_type: Joi.string(),
      size: Joi.number(),
    })
  ),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  addCommentSchema,
};
