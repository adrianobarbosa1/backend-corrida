import nodemailer from 'nodemailer'
import config from '../config/config'
import {logger} from '../config/logger'

const apiHost = config.env === 'production' ? config.apibase : `http://localhost:${config.port}/`

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('⚡️ Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


//Send an email
const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

const sendNewOauthUserEMail = async (to: string): Promise<any> => {
  const subject = 'Corrida de rua';
  const text = `Obrigado por se cadastrar no corrida de rua!, não responda esse email`;
  await sendEmail(to, subject, text)
}

//Send reset password email
const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Redefinição de senha';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${apiHost}api/v1/auth/reset-password?token=${token}`;
  const text = `Recuperação de senha,
Para resetar a sua senha, click nesse link: ${resetPasswordUrl}
Se você não solicitou a redefinição de senha, apenas ignore esse email. Por favor não responda esse email`;
  await sendEmail(to, subject, text);
};

//Send verification email
const sendVerificationEmail = async (to: string, token: string) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${apiHost}api/v1/auth/verify-email?token=${token}`;
  const text = `Verificação de email,
Para verificar seu email, click nesse link: ${verificationEmailUrl}
Se você não criou uma conta, apenas ignore esse email.`;
  await sendEmail(to, subject, text);
};

export default {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendNewOauthUserEMail,
};
