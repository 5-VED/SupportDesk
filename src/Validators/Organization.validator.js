const Joi = require('joi');

const createOrganizationSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Organization name is required'
    }),
    domains: Joi.array().items(Joi.string().domain()),
    is_active: Joi.boolean()
});

const updateOrganizationSchema = Joi.object({
    name: Joi.string(),
    domains: Joi.array().items(Joi.string().domain()),
    is_active: Joi.boolean(),
    settings: Joi.object()
});

module.exports = {
    createOrganizationSchema,
    updateOrganizationSchema
};
