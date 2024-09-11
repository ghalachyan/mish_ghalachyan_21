import Joi from 'joi';

export default {
    create: Joi.object({
        description: Joi.string().min(3).max(50).optional(),
    }),
};