import express from 'express'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'
import httpStatus from 'http-status'
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { authService } from './services'
import { userService } from './services'
import { emailService } from './services'
import config from './config/config'
import morgan from './config/morgan'
import { jwtStrategy } from './config/passport'
import { authLimiter } from './middlewares/rateLimiter'
import routes from './routes/v1'
import { errorConverter, errorHandler } from './middlewares/error'
import ApiError from './utils/ApiError'
import path from 'path'

const app = express();

//CONFIG
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// ENABLE CORS
if (config.env === 'development') {
  app.use(cors());
}

//SECURITY HTTP HEADERS REQUEST BODY
app.use(helmet({
  crossOriginResourcePolicy: false
}));

//PARSER JSON REQUEST BODY
app.use(express.json());
// app.use(express.json({ limit: 1.5 * 1024 * 1024 }));

//PARSER URLCONDED
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true, limit: 1.5 * 1024 * 1024 }));

//SANITIZE REQUEST DATA
app.use(mongoSanitize());

//GZIP COMPRESSION
app.use(compression({
  level: 6,
  threshold: 10 * 1000,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res)
  }
}));

//Google oauth 2.0
passport.use(new GoogleStrategy({
  clientID: config.google.id || '',
  clientSecret: config.google.secret || '',
  callbackURL: `http://localhost:${config.port}/api/v1/auth/google`
}, async (_, __, profile, done) => {

  try {

    const userMails = profile != null ? profile.emails : null;

    if (!userMails || userMails?.length === 0)
      return done(new ApiError(`${httpStatus.BAD_REQUEST}`, 'Email da conta do Google é obrigatório', false));

    const user = await userService.getUserByEmail(userMails[0].value);

    if (!user) {
      const name = profile.name?.givenName + " " + profile.name?.familyName;

      const user = await authService.createFacebookOrGoogleUser(userMails[0].value, name, 'GOOGLE_STRATEGY');

      if (!user) return done(new ApiError(`${httpStatus.BAD_REQUEST}`, 'Falha de autenticação com Google'), false);

      await emailService.sendNewOauthUserEMail(userMails[0].value);

      return done('', user)
    }

    done('', user);

  } catch (e) {
    return done(new ApiError(`${httpStatus.BAD_REQUEST}`, 'Falha de autenticação com Google'), false);
  }
}
));

//FACEBOOOK AUTH
passport.use(new FacebookStrategy({
  clientID: config.facebook.id || '',
  clientSecret: config.facebook.secret || '',
  callbackURL: `https://localhost:${config.port}/api/v1/auth/facebook`,
  profileFields: ['id', 'emails', 'name'],

}, async (__, _, profile, cb) => {
  try {
    const userMails = profile != null ? profile.emails : null;

    if (!userMails || userMails?.length === 0)
      return cb(new ApiError(`${httpStatus.BAD_REQUEST}`, 'Email da conta do facebook é obrigatório'), false);

    const user = await userService.getUserByEmail(userMails[0].value);

    if (!user) {
      const name = profile.name?.givenName + " " + profile.name?.familyName;
      const user = await authService.createFacebookOrGoogleUser(userMails[0].value, name, 'FACEBOOK_STRATEGY');

      if (!user) return cb(new ApiError('Falha de autenticação com Facebook', `${httpStatus.BAD_REQUEST}`), false);

      await emailService.sendNewOauthUserEMail(userMails[0].value);

      return cb(null, user)
    }
    cb(null, user);
  } catch (e) {
    return cb(new ApiError('Falha de autenticação com Facebook', `${httpStatus.BAD_REQUEST}`), false);
  }

}));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

//arquivo estatico
app.use('/imgUser', express.static(path.resolve(__dirname, "..", "tmp", "uploads")))
console.log(__dirname)

//ROUTES
app.use('/api/v1', routes);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(`${httpStatus.NOT_FOUND}`, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
