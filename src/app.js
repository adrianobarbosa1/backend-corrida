const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors')
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { authService } = require('./services');
const { userService } = require('./services')
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const app = express();

//CONFIG
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// ENABLE CORS
if (config.env === 'development') {
  app.use(cors());
  app.options('*', cors());
}

//SECURITY HTTP HEADERS REQUEST BODY
app.use(helmet());

//PARSER JSON REQUEST BODY
app.use(express.json());
// app.use(express.json({ limit: 1.5 * 1024 * 1024 }));

//PARSER URLCONDED
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true, limit: 1.5 * 1024 * 1024 }));

//SANITIZE REQUEST DATA
app.use(xss());
app.use(mongoSanitize());

//GZIP COMPRESSION
app.use(compression());

//FACEBOOOK AUTH
passport.use(new FacebookStrategy({

  clientID: config.facebook.id || '',
  clientSecret: config.facebook.secret || '',
  callbackURL: `http://localhost:${config.port}/api/v1/auth/auth/facebook`,
  profileFields: ['id', 'emails', 'name'],

}, async (__, _, profile, cb) => {
  try {
    const userMails = profile != null ? profile.emails : null;

    if (!userMails || userMails?.length === 0)
      return cb(new ApiError(httpStatus.BAD_REQUEST, 'Email da conta do facebook é obrigatório' ), false);

    const user = await userService.getUserByEmail(userMails[0].value);

    if (!user) {
      const name = profile.name?.givenName + " " + profile.name?.familyName;
      const user = await authService.createFaceBookOrGoogleUser(userMails[0].value, name, 'FACEBOOK_STRATEGY');

      if (!user) return cb(new ApiError('Falha de autenticação com Facebook', httpStatus.BAD_REQUEST), false);

      await emailService.sendNewOauthUserEMail(userMails[0].value);

      return cb(null, user)
    }
    cb(null, user);
  } catch (e) {
    console.log(e.message);
    return cb(new ApiError('Falha de autenticação com Facebook', httpStatus.BAD_REQUEST), false);
  }

}));

//Google oauth 2.0
passport.use(new GoogleStrategy({
  clientID: config.google.id || '',
  clientSecret: config.google.secret || '',
  callbackURL: `http://localhost:${config.port}/api/v1/auth/auth/google`
}, async (_, __, profile, done) => {

  try {

    const userMails = profile != null ? profile.emails : null;

    if (!userMails || userMails?.length === 0)
      return done(new ApiError(httpStatus.BAD_REQUEST ,'Email da conta do Google é obrigatório'), false);

    const user = await userService.getUserByEmail(userMails[0].value);

    if (!user) {
      const name = profile.name?.givenName + " " + profile.name?.familyName;

      const user = await authService.createFaceBookOrGoogleUser(userMails[0].value, name, 'GOOGLE_STRATEGY');
      if (!user) return done(new ApiError(httpStatus.BAD_REQUEST, 'Falha de autenticação com Google'), false);

      await emailService.sendNewOauthUserEMail(userMails[0].value);

      return done('', user)
    }

    done('', user);

  } catch (e) {
    console.log(e.message);
    return done(new ApiError(httpStatus.BAD_REQUEST, 'Falha de autenticação com Google'), false);
  }
}
));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

//ROUTES
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
