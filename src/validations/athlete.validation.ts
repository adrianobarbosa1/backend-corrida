import Joi from 'joi';
import { objectId, password } from './custom.validation';

const createAthlete = {
  body: Joi.object().keys({
    cpf: Joi.string().length(14).required().messages({ 'any.required': `"CPF" é obrigatorio` }),
    rg: Joi.string().required().messages({ 'any.required': `"RG" é obrigatorio` }),
    uf_rg: Joi.string().required().messages({ 'any.required': `"UFRG" é obrigatorio` }),
    genero: Joi.string().required().messages({ 'any.required': `"Gênero" é obrigatorio` }),
    fone: Joi.string().required().messages({ 'any.required': `"Fone" é obrigatorio` }),
    dt_nascimento: Joi.date()
      .required()
      .messages({ 'any.required': `"Data de nascimento" é obrigatorio` }),
    tipo_sanguineo: Joi.string(),
    alergia: Joi.string().optional().allow(''),
    cep: Joi.string().required().messages({ 'any.required': `"CEP" é obrigatorio` }),
    uf: Joi.string().required().messages({ 'any.required': `"UF" é obrigatorio` }),
    municipio: Joi.string().required().messages({ 'any.required': `"Município" é obrigatorio` }),
    bairro: Joi.string().required().messages({ 'any.required': `"Bairro" é obrigatorio` }),
    logradouro: Joi.string().required().messages({ 'any.required': `"Logradouro" é obrigatorio` }),
    quadra: Joi.string().optional().allow(''),
    lote: Joi.string().optional().allow(''),
    complemento: Joi.string().optional().allow(''),
  }),
};

const showAthlete = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const uploadFoto = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
}

const registerEvent = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    eventId: Joi.string().custom(objectId),
  }),
}

const updateAthlete = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      cpf: Joi.string().length(14).optional(),
      rg: Joi.string().optional(),
      uf_rg: Joi.string().optional(),
      genero: Joi.string().optional(),
      fone: Joi.string().optional(),
      dt_nascimento: Joi.date().optional(),
      tipo_sanguineo: Joi.string(),
      alergia: Joi.string(),
      pais: Joi.string().optional(),
      cep: Joi.string().optional(),
      uf: Joi.string().optional(),
      municipio: Joi.string().optional(),
      bairro: Joi.string().optional(),
      logradouro: Joi.string().optional(),
      quadra: Joi.string().optional(),
      lote: Joi.string().optional().allow(''),
      complemento: Joi.string().optional().allow(''),
    })
    .min(1),
};

export default {
  createAthlete,
  uploadFoto,
  registerEvent,
  showAthlete,
  updateAthlete,
};
