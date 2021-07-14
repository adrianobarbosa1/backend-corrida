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
      cpf: Joi.string().length(14).optional().error(() => {
        return { message: 'CPF Inválido.'};
      }),
      cpf_responsavel: Joi.string().length(14).optional().error(() => {
        return {message: 'CPF Inválido.'};
      }),
      dt_nascimento: Joi.date().required(),
      rg: Joi.string().optional(),
      uf_rg: Joi.string().optional(),
      equipe: Joi.string().optional(),
      sexo: Joi.string().required()
    }
  },
  update: {
    body: {
      nome: Joi.string().optional(),
      email: Joi.string().email().optional(),
      telefone: Joi.string().optional(),
      cpf: Joi.string().length(14).optional().error(() => {
        return {
          message: 'CPF Inválido.',
        }
      }),
      cpf: Joi.string().length(14).error(() => {
        return {
          message: 'CPF Inválido.',
        }
      }),
      dt_nascimento: Joi.date().optional(),
      rg: Joi.string().optional(),
      uf_rg: Joi.string().optional(),
      equipe: Joi.string().optional(),
      sexo: Joi.string().optional(),
      alimento_doado: Joi.string().optional()
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