const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require("mongoose-paginate");

const CadastroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "não pode ficar vazio."],
  },
  email: {
    type: String,
    required: [true, "não pode ficar vazio."],
  },
  telefone: {
    type: String,
    required: [true, "não pode ficar vazio."]
  },
  cpf: {
    type: String,
    unique: true,
    required: [true, "não pode ficar vazio."]
  },
  cpf_responsavel: {
    type: String,
  },
  dt_nascimento: {
    type: Date,
    required: [true, "não pode ficar vazio"]
  },
  rg: {
    type: String,
    required: [true, "não pode ficar vazio."],
  },
  uf_rg: {
    type: String,
    required: [true, "não pode ficar vazio."],
  },
  equipe: {
    type: String,
  },
  sexo: {
    type: String,
    required: [true, "não pode ficar vazio."],
  },
  alimento_doado: {
    type: Boolean,
    required: [true, "não pode ficar vazio."],
    default: false
  },
  deletado: {
    type: Boolean,
    required: [true, "não pode ficar vazio."],
    default: false
  },
}, { timestamps: true }, { collection: 'cadastro' });

CadastroSchema.plugin(mongoosePaginate);
CadastroSchema.plugin(uniqueValidator, { message: "já está sendo utilizado" });

module.exports = mongoose.model("Cadastro", CadastroSchema);