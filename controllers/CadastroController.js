const mongoose = require('mongoose');
const Cadastro = mongoose.model('Cadastro');
const moment = require('moment');

class CadastroController {

  index(req, res, next) {
    const cadastros = Cadastro.find({ deletado: false })
      .then(cadastros => {
        return res.json({ cadastros })
      }).catch(next);
  }

  //GET /:cpf
  show(req, res, next) {
    const { cpf } = req.body
    Cadastro.findOne({ cpf })
      .then(cadastro => {
        if (!cadastro) return res.status(401).json({ errors: "Cadastro não registrado" })
        return res.json({ cadastro })
      }).catch(next)
  }

  //POST /registrar //CREATE
  store(req, res, next) {
    const { nome, email, telefone, cpf, cpf_responsavel, dt_nascimento, rg, uf_rg,
      equipe, sexo, alimento_doado } = req.body

    const error = []
    if(!nome) error.push('nome')
    if(!email) error.push('email')
    if(!telefone) error.push('telefone')
    if(!cpf) error.push('cpf')
    if(!dt_nascimento) error.push('dt_nascimento')
    if(!sexo) error.push('sexo')
    if(error.length > 0) return res.status(422).json({ error: "required", payload: error})

    const numeroInscricao = moment().format('YYMhmmss')
    
    const cadastro = new Cadastro({ nome, email, telefone, cpf, cpf_responsavel, 
      dt_nascimento, rg, uf_rg, equipe, sexo, alimento_doado, numeroInscricao })

    cadastro.save()
      .then(() => res.json({ cadastro }))
      .catch(()=> res.status(422).json({ errors: "cpf já cadastrado" })) 
  }

  update(req, res, next) {
    const {
      nome,
      email,
      telefone,
      cpf,
      cpf_responsavel,
      dt_nascimento,
      rg,
      uf_rg,
      equipe,
      sexo,
      alimento_doado
    } = req.body;

    Cadastro.findById(req.params.id)
      .then((cadastro) => {
        if (!cadastro) return res.status(401).json({ errors: "Cadastro não alterado" });
        if (typeof nome !== "undefined") cadastro.nome = nome;
        if (typeof email !== "undefined") cadastro.email = email;
        if (typeof telefone !== "undefined") cadastro.telefone = telefone;
        if (typeof cpf !== "undefined") cadastro.cpf = cpf;
        if (typeof cpf_responsavel !== "undefined") cadastro.cpf_responsavel = cpf_responsavel;
        if (typeof dt_nascimento !== "undefined") cadastro.dt_nascimento = dt_nascimento;
        if (typeof rg !== "undefined") cadastro.rg = rg;
        if (typeof uf_rg !== "undefined") cadastro.uf_rg = uf_rg;
        if (typeof equipe !== "undefined") cadastro.equipe = equipe;
        if (typeof sexo !== "undefined") cadastro.sexo = sexo;
        if (typeof alimento_doado !== "undefined") cadastro.alimento_doado = alimento_doado;
        return cadastro.save()
          .then(() => { return res.json({ cadastro }); })
          .catch(next);
      })
      .catch(next);
  }

  //DELETE /
  remove(req, res, next) {
    Cadastro.findById(req.params.id)
      .then(cadastro => {
        console.log(req.params.id, cadastro)
        if (!cadastro) return res.status(401).json({ errors: 'Cadastro não registrado' });
        cadastro.deletado = true;
        return cadastro.save().then(() => {
          return res.json({ cadastro: true });
        })
          .then(() => registro.save())
          .catch(next);
      }).catch(next)
  }
}

module.exports = CadastroController