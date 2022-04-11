import config from './config'
import jwt from 'jsonwebtoken'

const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
};

const createJwt = (id) => {
  const secret = config.secret;
        const jwtExpiryTime = config.accessExpirationMinutes;

        if (!secret) {
            throw new AppError('NO_JWT_SECRET_MSG,INTERNAL_SERVER_ERROR');
          }

        if (!jwtExpiryTime) {
            throw new AppError('NO_JWT_EXPIRY_TIME_MSG,INTERNAL_SERVER_ERROR');
          }

        return jwt.sign({id:id},secret,{ expiresIn: jwtExpiryTime})
}

export default {
  tokenTypes,
  createJwt,
};