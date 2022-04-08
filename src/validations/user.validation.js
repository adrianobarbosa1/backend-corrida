const Joi = require("joi");
const { password, objectId } = require('./custom.validation');

const createUser = {
    body: Joi.object().keys({
        cpf: Joi.string().length(14).optional(),
        password: Joi.string(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().required().valid('user', 'admin'),
    })
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            cpf: Joi.string().length(14).optional(),
            password: Joi.string().custom(password),
            name: Joi.string(),
            email: Joi.string().email(),
        })
        .min(1),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser
};
