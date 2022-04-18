import config from './config'
import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

export const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
};

interface CreateJwt {
  id: string;
}

export const createJwt = (id:CreateJwt) => {
  const secret = config.jwt.secret;
        const jwtExpiryTime = config.jwt.accessExpirationMinutes;

        if (!secret) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Secret não encontrada');
          }

        if (!jwtExpiryTime) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Tempo de expiração não encontrado');
          }

        return jwt.sign({id:id},secret,{ expiresIn: jwtExpiryTime})
}
