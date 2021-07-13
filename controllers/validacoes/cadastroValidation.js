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
      cpf: Joi.string().length(14).required().error(() => {
        return { message: 'CPF Inválido.'};
      }),
      cpf_responsavel: Joi.string().length(14).error(() => {
        return {message: 'CPF Inválido.'};
      }),
      dt_nascimento: Joi.date().required(),
      rg: Joi.string().required(),
      uf_rg: Joi.string().required(),
      equipe: Joi.string().required(),
      sexo: Joi.string().required()
    }
  },
  update: {
    body: {
      nome: Joi.string().required(),
      email: Joi.string().email().required(),
      telefone: Joi.string().required(),
      cpf: Joi.string().length(14).required().error(() => {
        return {
          message: 'CPF Inválido.',
        }
      }),
      cpf: Joi.string().length(14).error(() => {
        return {
          message: 'CPF Inválido.',
        }
      }),
      dt_nascimento: Joi.date().required(),
      rg: Joi.string().required(),
      uf_rg: Joi.string().required(),
      equipe: Joi.string().required(),
      sexo: Joi.string().required(),
      alimento_doado: Joi.string().required()
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