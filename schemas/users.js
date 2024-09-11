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
}