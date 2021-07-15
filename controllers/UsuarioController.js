const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const enviarEmailRecovery = require('../helpers/email-recovery');

class UsuarioController {

    //GET /  INDEX SHOW
    index(req, res, next) {
        Usuario.findById(req.payload.id)
            .then(usuario => {
                if (!usuario) return res.status(401).json({ errors: 'Usuario não registrado' })
                return res.json({
                    usuario: usuario.enviarAuthJSON()
                })
            }).catch(next)
    }

    //GET /:id SHOW ID
    show(req, res, next) {
        Usuario.findById(req.payload.id)
            .then(usuario => {
                if (!usuario) return res.status(401).json({ errors: 'Usuario não registrado' })
                return res.json({
                    usuario: {
                        nome: usuario.nome,
                        email: usuario.email,
                        username: usuario.username,
                        permissao: usuario.permissao
                    }
                })
            }).catch(next)
    }

    //POST /registrar  CREATE
    store(req, res, next) {
        const { 
            nome, 
            username, 
            email, 
            password } = req.body

        if (!nome || !username || !email || !password) return res.status(422).json({ errors: 'preencha todos os campos de cadastro' })

        const usuario = new Usuario({ nome, username, email })
        usuario.setSenha(password)
        usuario.save()
            .then(() => res.json({ usuario: usuario.enviarAuthJSON() }))
            .catch(next);
    }

    //PUT / UPDATE
    update(req, res, next) {
        const { nome, username, email, password } = req.body
        Usuario.findById(req.payload.id).then((usuario) => {
            if (!usuario) return res.status(401).json({ errors: 'usuario não registrado' })
            if (typeof nome !== "undefined") usuario.nome = nome
            if (typeof username !== "undefined") usuario.username = username
            if (typeof email !== "undefined") usuario.email = email
            if (typeof password !== "undefined") usuario.setSenha(password)
            return usuario.save().then(() => {
                return res.json({ usuario: usuario.enviarAuthJSON() })
            }).catch(next)
        }).catch(next)
    }

    //DELETE /
    remove(req, res, next) {
        Usuario.findById(req.payload.id).then(usuario => {
            if (!usuario) return res.status(401).json({ errors: 'Usuario não registrado' })
            return usuario.remove().then(() => {
                return res.json({ deletado: true })
            }).catch(next)
        }).catch(next)
    }

    //POST /login
    login(req, res, next) {
        const { username, password } = req.body;
        if (!username) return res.status(401).json({ errors: "Não pode ficar vazio" })
        if (!password) return res.status(401).json({ errors: "Não pode ficar vazio" })

        Usuario.findOne({ username }).then((usuario) => {
            if (!usuario) return res.status(401).json({ errors: "Usuario não registrado" })
            if (!usuario.hash) return res.status(401).json({ errors: "Usuario sem senha" })
            if (!usuario.validarSenha(password)) return res.status(401).json({ errors: "Senha inválida" })
            return res.json({ usuario: usuario.enviarAuthJSON() })
        }).catch(next)
    }

    //RECOVERY
    //GET /recuperar-senha
    showRecovery(req, res, next) {
        return res.render('recovery', { error: null, success: null })
    }

    //POST /recuperar-senha
    createRecovery(req, res, next) {
        const { email } = req.body;
        if (!email) return res.render('recovery', { error: "Preencha com o seu email", success: null })

        Usuario.findOne({ email }).then((usuario) => {
            if (!usuario) return res.render('recovery', { error: 'Não existe usuário com este email', success: null })
            const recoveryData = usuario.criarTokenRecuperacaoSenha();
            return usuario.save().then(() => {
                enviarEmailRecovery({ usuario, recovery: recoveryData }, (error = null, success = null) => {
                    return res.render('recovery', { error, success })
                })
            }).catch(next)
        }).catch(next)
    }

    //GET / senha-recuperada
    showCompleteRecovery(req, res, next) {
        if (!req.query.token) return res.render("recovery", { error: "Token não identificado", success: null })
        Usuario.findOne({ "recovery.token": req.query.token }).then(usuario => {
            if (!usuario) return res.render("recovery", { error: "Não existe usuário com este token", success: null })
            if (new Date(usuario.recovery.date) < new Date()) return res.render("recovery", { error: "Token expirado. Tente novamente.", success: null })
            return res.render("recovery/store", { error: null, success: null, token: req.query.token })
        }).catch(next)
    }

    //POST /senha-recuperada
    completeRecovery(req, res, next) {
        const { token, password } = req.body;
        if (!token || !password) return res.render("recovery/store", { error: "Preencha novamente com sua nova senha", success: null, token: token })
        Usuario.findOne({ "recovery.token": token }).then(usuario => {
            if (!usuario) return res.render("recovery", { error: "Usuario nao identificado", success: null })

            usuario.finalizarTokenRecuperacaoSenha()
            usuario.setSenha(password);
            return usuario.save().then(() => {
                return res.render("recovery/store", {
                    error: null,
                    success: "Senha alterada com sucesso. Tente novamente fazer login.",
                    token: null
                });
            }).catch(next);
        });
    }

}

// async login(req, res, next) {
//     var params = req.body
//     console.log(params)
//     // let usuario = 'andrewisley'
//     let groupName = 'RHSIS'
//     // let passwordUser = 'andre2611'
//     let usuario = params.cpf
//     //let groupName = params.group
//     let passwordUser = params.senha

//     let usernameUser = usuario + '@anapolis.go.gov.br'
//     let userDn = 'DC=anapolis,DC=go,DC=gov,DC=br'
//     var user = usernameUser.split('@')
//     var sAMAccountName = user[0];
//     var config = {
//         url: 'ldap://10.2.200.11',
//         baseDN: userDn,
//         username: 'redmine@anapolis.go.gov.br',
//         password: 'PM@redmine@2020',
//         attributes: {
//             user: ['sAMAccountName', 'description', 'cn', 'dn', 'userPrincipalName', 'objectSid']
//         },
//         filter: 'CN=*',
//     }
//     var ad = new ActiveDirectory(config);

//     ad.authenticate(usernameUser, passwordUser, function (err, auth) {

//         if (auth) {

//             ad.isUserMemberOf(sAMAccountName, groupName, function (err, isMember) {
//                 if (err) {
//                     console.log('ERROR: ' + JSON.stringify(err));
//                     return;
//                 }

//                 if (isMember === false) {
//                     res.status(403).json({ message: "Usuario:" + usernameUser + " não Autorizado no Grupo:" + groupName })
//                 }
//                 else {
//                     ad.findUser(sAMAccountName, function (err, result) {
//                         if (err) {
//                             // console.log(err);
//                             console.log("No Groups found.");
//                         }
//                         console.log(result)
//                         //auth ok
//                         let id = result.objectSid
//                         let cpf = result.description
//                         let username = result.sAMAccountName
//                         let nome = result.cn
//                         var busca = Usuarios.findAndCountAll({
//                             where: { cpf: cpf, userid: id, excluido: false }
//                         }).then(response => {
//                             var teste = response.rows[0]
//                             var permissao = teste.dataValues.permissao
//                             if (response.count > 0) {
//                                 var token = jwt.sign({ id, cpf, username, permissao }, process.env.SECRET, {
//                                     expiresIn: 300000 // expires in 5min
//                                 });
//                                 let criptToken = 'Bearer ' + token
//                                 return res.json({ token: criptToken });
//                             }
//                         })

//                     })
//                 }
//             });
//         }
//         else {
//             res.status(403).json({ message: "Usuario ou senha incorreta" })
//         }
//     });
// }


module.exports = UsuarioController