import Joi from 'joi';
import { objectId, password } from './custom.validation';

const createDependents = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    dt_nascimento: Joi.date().required(),
    gender: Joi.string().required(),
    team: Joi.string().optional().allow(''),
  }),
};

const getAthlete = {
  params: Joi.object().keys({
    athleteId: Joi.string().custom(objectId),
  }),
};

const updateAthlete = {
  params: Joi.object().keys({
    athleteId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      cpf: Joi.string().length(14).required(),
      rg: Joi.string().required(),
      uf_rg: Joi.string().required(),
      genero: Joi.string().required(),
      dt_nascimento: Joi.date().required(),
      pais: Joi.string().required(),
      cep: Joi.string().required(),
      uf: Joi.string().required(),
      municipio: Joi.string().required(),
      bairro: Joi.string().required(),
      logradouro: Joi.string().required(),
      quadra: Joi.string().required(),
      lote: Joi.string().optional().allow(''),
      complemento: Joi.string().optional().allow(''),
    })
    .min(1),
};

export default {
  createDependents,
  getAthlete,
  updateAthlete,
};
