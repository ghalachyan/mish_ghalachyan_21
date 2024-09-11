import Joi from 'joi';

export default {
    create: Joi.object({
        description: Joi.string().min(3).max(50).optional(),
    }),

    getPosts: Joi.object({
        page: Joi.number().integer().min(1).max(10000000).default(1).optional(),
        limit: Joi.number().integer().min(5).max(20).default(5).optional(),
        order: Joi.string().valid('id', 'desc').default('desc').optional(),
        orderBy: Joi.string().valid('createdAt', 'updatedAt').default('createdAt').optional(),
    }),
};