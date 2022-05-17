import Joi from 'joi';
import { password, objectId } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({ 'any.required': `"Email" é obrigatorio` }),
    password: Joi.string().required().messages({ 'any.required': `"Senha" é obrigatorio` }),
    name: Joi.string().required().messages({ 'any.required': `"Nome" é obrigatorio` }),
    role: Joi.string().required().valid('user', 'admin'),
  }),
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
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export default {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
