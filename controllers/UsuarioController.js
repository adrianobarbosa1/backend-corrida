const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const enviarEmailRecovery = require('../helpers/email-recovery');
const ActiveDirectory = require('activedirectory');
var jwt = require('jsonwebtoken');
const secret = require('../config').secret;

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

    //POST /login
    async login(req, res, next) {
        var params = req.body
        // let usuario = 'andrewisley'
        let groupName = 'RHSIS'
        // let passwordUser = 'andre2611'
        let usuario = params.cpf
        //let groupName = params.group
        let passwordUser = params.senha

        let usernameUser = usuario + '@anapolis.go.gov.br'
        let userDn = 'DC=anapolis,DC=go,DC=gov,DC=br'
        var user = usernameUser.split('@')
        var sAMAccountName = user[0];
        var config = {
            url: 'ldap://10.2.200.11',
            baseDN: userDn,
            username: 'redmine@anapolis.go.gov.br',
            password: 'PM@redmine@2020',
            attributes: {
                // user: ['sAMAccountName', 'description', 'cn', 'dn', 'userPrincipalName', 'objectSid'],
                user: [
                    'dn', 'distinguishedName',
                    'userPrincipalName', 'sAMAccountName', 'mail',
                    'lockoutTime', 'whenCreated', 'pwdLastSet', 'userAccountControl',
                    'employeeID', 'sn', 'givenName', 'initials', 'cn', 'displayName',
                    'comment', 'description'
                ]
            },
            filter: 'CN=*',
        }
        var ad = new ActiveDirectory(config);

        var query = 'ROLE_ADM';
        // ad.groupExists(query, function (err, exists) {
        //     if (err) {
        //         console.log('ERROR: ' + JSON.stringify(err));
        //         return;
        //     }
        //     console.log(query + ' exists: ' + exists);
        // });

        ad.getGroupMembershipForUser(usernameUser, function (err, groups) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }

            if (!groups) console.log('User: ' + sAMAccountName + ' not found.');
            else console.log(JSON.stringify(groups));
        });


        ad.authenticate(usernameUser, passwordUser, function (err, auth) {

            if (auth) {

                ad.isUserMemberOf(sAMAccountName, groupName, function (err, isMember) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        return;
                    }

                    if (isMember === false) {

                        res.status(403).json({ message: "Usuario:" + usernameUser + " não Autorizado no Grupo:" + groupName })
                    }
                    else {
                        ad.findUser(sAMAccountName, function (err, result) {
                            if (err) {
                                // console.log(err);
                                console.log("No Groups found.");
                            }
                            let id = result.objectSid
                            let cpf = result.description
                            let username = result.sAMAccountName
                            let email = result.userPrincipalName
                            let nome = result.cn
                            let permissao = query


                            var token = jwt.sign({ id, cpf, username, permissao }, secret, {
                                expiresIn: 300000 // expires in 5min
                            });
                            let criptToken = 'Bearer ' + token
                            return res.json({ token: criptToken });

                        })
                    }
                });
            }
            else {
                res.status(403).json({ message: "Usuario ou senha incorreta" })
            }
        });
    }
}
module.exports = UsuarioController