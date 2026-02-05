const Joi = require('joi');

const createGroupSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Group name is required',
  }),
  description: Joi.string(),
  organization_id: Joi.string().hex().length(24),
});

const updateGroupSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  createGroupSchema,
  updateGroupSchema,
};
