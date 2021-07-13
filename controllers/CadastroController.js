const mongoose = require('mongoose');
const Cadastro = mongoose.model('Cadastro');
const moment = require('moment');

class CadastroController {

  index(req, res, next) {
    const cadastros = Cadastro.find({ deletado: false }).then(cadastros => {
      return res.json({ cadastros })
    }).catch(next);
  }

  //GET /:cpf
  show(req, res, next) {
    const { cpf } = req.body
    Cadastro.findOne({ where: {cpf: cpf} })
      .then(cadastro => {
        if (!cadastro) return res.status(401).json({ errors: "Cadastro não registrado" });
        // if ( cpf !== cpf) return res.status(401).json({ errors: "CPF não cadastrado" })
        return res.json({ cadastro });
      }).catch(next);
  }

  //POST /registrar //CREATE
  store(req, res, next) {
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
    } = req.body

    const cadastro = new Cadastro({
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
    })

    cadastro.save()
      .then(() => res.json({ cadastro }))
      .catch(next);
  }

  update(req, res, next) {

    const {
      nome,
      telefone,
      cpf,
      dt_nascimento,
      rg,
      uf_rg,
      acamado,
      endereco,
      tipo_cadastro,
      nome_mae,
      sexo,
      cns,
      profissao
    } = req.body;

    // REGRAS DE CALCULAR IDADE
    function calculaTempo(data) {

      var dataAtual = new Date();
      var anoAtual = dataAtual.getFullYear();
      var anoDataParts = data.split('/');
      var diaData = anoDataParts[0];
      var mesData = anoDataParts[1];
      var anoData = anoDataParts[2];
      var idade = anoAtual - anoData;
      var mesAtual = dataAtual.getMonth() + 1;
      //Se mes atual for menor que a data informada, nao fez ano ainda;  
      if (mesAtual < mesData) {
        idade--;
      } else {
        //Se estiver no mes da data informada, verificar o dia
        if (mesAtual == mesData) {
          if (new Date().getDate() < diaData) {
            //Se a data atual for menor que a data informada ele ainda nao fez ano
            idade--;
          }
        }
      }
      return idade;
    }

    Cadastro.findById(req.params.id).then((cadastro) => {
      const registro = new Log({
        usuario: req.payload.id,
        acao: 'Usuário alterou dados de um Cadastro',
        tipo: 'Cadastros',
        id_modificado: cadastro._id
      })
      if (!cadastro) return res.status(401).json({ errors: "cadastro não registrado" });
      if (typeof nome !== "undefined") cadastro.nome = nome;
      if (typeof telefone !== "undefined") cadastro.telefone = telefone;
      if (typeof cpf !== "undefined") cadastro.cpf = cpf;
      if (typeof dt_nascimento !== "undefined") cadastro.dt_nascimento = dt_nascimento;
      if (typeof dt_nascimento !== "undefined") cadastro.idade = calculaTempo(moment(dt_nascimento).format('DD/MM/YYYY'));
      if (typeof rg !== "undefined") cadastro.rg = rg;
      if (typeof uf_rg !== "undefined") cadastro.uf_rg = uf_rg;
      if (typeof acamado !== "undefined") cadastro.acamado = acamado;
      if (typeof endereco.cep !== "undefined") cadastro.endereco.cep = endereco.cep;
      if (typeof endereco.rua !== "undefined") cadastro.endereco.rua = endereco.rua;
      if (typeof endereco.quadra !== "undefined") cadastro.endereco.quadra = endereco.quadra;
      if (typeof endereco.lote !== "undefined") cadastro.endereco.lote = endereco.lote;
      if (typeof endereco.complemento !== "undefined") cadastro.endereco.complemento = endereco.complemento;
      if (typeof endereco.ponto_referencia !== "undefined") cadastro.endereco.ponto_referencia = endereco.ponto_referencia;
      if (typeof endereco.cidade !== "undefined") cadastro.endereco.cidade = endereco.cidade;
      if (typeof endereco.uf !== "undefined") cadastro.endereco.uf = endereco.uf;
      if (typeof endereco.bairro !== "undefined") cadastro.endereco.bairro = endereco.bairro;
      if (typeof endereco.numero !== "undefined") cadastro.endereco.numero = endereco.numero;
      if (typeof tipo_cadastro !== "undefined") cadastro.tipo_cadastro = tipo_cadastro;
      if (typeof nome_mae !== "undefined") cadastro.nome_mae = nome_mae;
      if (typeof sexo !== "undefined") cadastro.sexo = sexo;
      if (typeof cns !== "undefined") cadastro.cns = cns;
      if (typeof profissao !== "undefined") cadastro.profissao = profissao;
      return cadastro.save().then(() => {
        return res.json({ cadastro });
      })
        .then(() => registro.save())
        .catch(next);
    }).catch(next);
  }
  //DELETE /
  remove(req, res, next) {

    Cadastro.findById(req.payload.id).then(usuario => {
      if (!usuario) return res.status(401).json({ errors: 'Usuario não registrado' });
      const registro = new Log({
        usuario: req.payload.id,
        acao: `Usuário desativou um cadastro - ${usuario.cpf}`,
        tipo: 'Cadastros',
        id_modificado: usuario._id
      })
      usuario.deletado = true;
      return usuario.save().then(() => {
        return res.json({ deletado: true });
      })
        .then(() => registro.save())
        .catch(next);
    }).catch(next)
  }
}

module.exports = CadastroController