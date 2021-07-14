const transporter = require('nodemailer').createTransport(require('../config/email'));
const { api: link } = require('../config');

module.exports = ({ usuario, recovery }, cb) => {
    const message = `
    <h1 style="text-align: center;">Recuperação de Senha</h1>
    <br />
    <p>
        Acesse o link abaixo e digite a sua nova senha:
    </p>
   <a href="${link}/api/v1/usuarios/senha-recuperada?token=${recovery.token}">
            ${link}/api/v1/usuarios/senha-recuperada?token=${recovery.token}
        </a>
    <br/><br/><hr/>
    <p>
        Obs.: Se você não solicitou a redefinição, apenas ignore esse email.
    </p>
    <br />
    <p> Atenciosamente, Equipe de corrida Anápolis - Desafio orgulho de correr aqui!</p>
    `;

    const opcoesEmail = {
        from: 'adriano.dev100@gmail.com',
        to: usuario.email,
        subject: 'Redefinição de senha - Equipe de corrida Anápolis',
        html: message
    }

    // if (process.env.NODE_ENV === 'production') {
        transporter.sendMail(opcoesEmail, (error, info) => {
            if (error) {
                console.log(error);
                return cb('Aconteceu um erro no envio do email, tente novamente.');
            } else {
                return cb(null, 'Link para redefinição de senha foi enviado com sucesso para seu email.')
            }
        })
    // } else {
    //     console.log(opcoesEmail)
    //     return cb(null, 'Link para redefinição de senha foi enviado com sucesso para seu email.')
    // }
}
