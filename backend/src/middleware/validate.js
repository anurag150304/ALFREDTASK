const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));
            return res.status(400).json({ errors });
        }

        next();
    };
};

// Validation schemas
const schemas = {
    auth: {
        register: Joi.object({
            username: Joi.string().min(3).max(30).required(),
            password: Joi.string().min(6).required()
        }),
        login: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    },
    flashcard: {
        create: Joi.object({
            question: Joi.string().required().trim(),
            answer: Joi.string().required().trim(),
            deckId: Joi.string().required()
        }),
        update: Joi.object({
            question: Joi.string().trim(),
            answer: Joi.string().trim(),
            isCorrect: Joi.boolean()
        })
    },
    deck: {
        create: Joi.object({
            name: Joi.string().required().trim(),
            description: Joi.string().trim()
        }),
        update: Joi.object({
            name: Joi.string().trim(),
            description: Joi.string().trim()
        })
    }
};

module.exports = {
    validate,
    schemas
}; 