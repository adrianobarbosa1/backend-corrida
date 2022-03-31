const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors')
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
if(config.env !== 'test'){
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
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

// ENABLE CORS
if (config.env === 'development'){
  app.use(cors());
  app.options('*', cors());
} 

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
