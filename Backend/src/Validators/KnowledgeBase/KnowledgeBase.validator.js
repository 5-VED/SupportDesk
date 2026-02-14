const Joi = require('joi');

const createCategorySchema = Joi.object({
    body: Joi.object({
        name: Joi.string().min(2).required(),
        description: Joi.string().allow(''),
        icon: Joi.string().default('Folder'),
        color: Joi.string().default('#3b82f6'),
        slug: Joi.string().lowercase().required(),
        order: Joi.number().default(0),
    }),
});

const updateCategorySchema = Joi.object({
    params: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        name: Joi.string().min(2),
        description: Joi.string().allow(''),
        icon: Joi.string(),
        color: Joi.string(),
        slug: Joi.string().lowercase(),
        order: Joi.number(),
    }),
});

const createArticleSchema = Joi.object({
    body: Joi.object({
        title: Joi.string().min(3).required(),
        slug: Joi.string().lowercase().required(),
        category: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string()),
        status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
        is_featured: Joi.boolean().default(false),
    }),
});

const updateArticleSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        title: Joi.string().min(3),
        slug: Joi.string().lowercase(),
        category: Joi.string(),
        content: Joi.string(),
        tags: Joi.array().items(Joi.string()),
        status: Joi.string().valid('draft', 'published', 'archived'),
        is_featured: Joi.boolean(),
    }),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
    createArticleSchema,
    updateArticleSchema,
};
