import Joi from 'joi';

export default {
    registration: Joi.object({
        userName: Joi.string().trim().min(2).max(20).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(8).max(16).required(),
    }),

    login: Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(8).max(16).required()
    }),

    activate: Joi.object({
        key: Joi.string().min(3).max(200).required(),
    }),

    updatePassword: Joi.object({
        password: Joi.string().min(3).max(50).required(),
        duplicatePassword: Joi.string().min(3).max(50).required(),
    }),

    userPosts: Joi.object({
        order: Joi.string().valid('asc', 'desc').required(),
    }),

    follow: Joi.object({
        followId: Joi.number().integer().positive().required(),
    }),

    getFollowers: Joi.object({
        page: Joi.number().integer().min(1).max(10000000).default(1).required(),
        limit: Joi.number().integer().min(5).max(20).default(5).required(),
        order: Joi.string().valid('asc', 'desc').default('desc').required(),
        orderBy: Joi.string().valid('createdAt', 'updatedAt').default('createdAt').required(),
    }),

    unfollow: Joi.object({
        followId: Joi.number().integer().positive().required(),
    }),
}