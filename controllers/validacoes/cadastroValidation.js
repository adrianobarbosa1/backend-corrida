const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);

const CadastroValidation = {

  show: {
    body: {
      cpf: Joi.string().length(14).required().error(() => {
        return { message: 'CPF Inválido.'};
      })
    }
  },
  store: {
    body: {
      nome: Joi.string().required(),
      email: Joi.string().email().required(),
      telefone: Joi.string().required(),
      cpf: Joi.string().min(14).required().error(() => {
        return { message: 'CPF Inválido.'};
      }),
      cpf_responsavel: Joi.string().length(14).optional().allow('').error(() => {
        return {message: 'CPF Inválido.'};
      }),
      dt_nascimento: Joi.date().required(),
      rg: Joi.string().optional().allow(''),
      uf_rg: Joi.string().optional().allow(''),
      equipe: Joi.string().optional().allow(''),
      sexo: Joi.string().required()
    }
  },
  update: {
    body: {
      nome: Joi.string().optional().allow(''),
      email: Joi.string().email().optional().allow(''),
      telefone: Joi.string().optional().allow(''),
      cpf: Joi.string().length(14).required().error(() => {
        return {
          message: 'CPF Inválido.',
        }
      }),
      cpf_responsavel: Joi.string().length(14).optional().allow('').error(() => {
        return {
          message: 'CPF Inválido.',
        }
      }),
      dt_nascimento: Joi.date().optional().allow(''),
      rg: Joi.string().optional().allow(''),
      uf_rg: Joi.string().optional().allow(''),
      equipe: Joi.string().optional().allow(''),
      sexo: Joi.string().optional().allow(''),
      alimento_doado: Joi.string().optional().allow('')
    }
  },
  remove: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  }
};

module.exports = {
  CadastroValidation
};