import Joi from "joi";

const createAthlete = {
  body: Joi.object().keys({
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
}
export default {
  createAthlete
}
