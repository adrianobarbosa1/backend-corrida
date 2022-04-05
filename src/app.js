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
const cookieParser = require('cookie-parser')
const app = express();

//Google Auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.googleAuth.googleId);

app.use(express.static('./public'));

//CONFIG
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// SETUP EJS
app.set("view engine", "ejs");
//SECURITY HTTP HEADERS REQUEST BODY
app.use(helmet());

//PARSER JSON REQUEST BODY
app.use(express.json());
// app.use(express.json({ limit: 1.5 * 1024 * 1024 }));

//MIDDLEWARE
app.use(cookieParser());

//PARSER URLCONDED
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true, limit: 1.5 * 1024 * 1024 }));

//SANITIZE REQUEST DATA
app.use(xss());
app.use(mongoSanitize());

//GZIP COMPRESSION
app.use(compression());

// ENABLE CORS
if (config.env === 'development') {
  app.use(cors());
  app.options('*', cors());
}

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//===================================================================
//googleauth
app.get('/', (req, res) => {
  res.render('index')
});

app.get('/login', (req, res) => {
  res.render('login2')
});

// app.post('/login', (req, res) => {
//   let token = req.body.token;

//   console.log(token)
//   async function verify() {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: config.googleAuth.googleId,

//     });
//     const payload = ticket.getPayload();
//     const userid = payload['sub'];
//     console.log(payload)

//   }
//   verify()
//     .then(() => {
//       res.cookie('session-token', token);
//       res.send('success');
//     }).catch(console.error);
// })

// app.get('/profile', checkAuthenticated, (req, res) => {
//   let user = req.user;
//   res.render('profile', { user });
// })

// app.get('/protectedRoute', checkAuthenticated, (req, res) => {
//   res.send('This route is protected')
// })

// app.get('/logout', (req, res) => {
//   res.clearCookie('session-token');
//   res.redirect('/login')
// })

// function checkAuthenticated(req, res, next) {

//   let token = req.cookies['session-token'];

//   let user = {};
//   async function verify() {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//     });
//     const payload = ticket.getPayload();
//     user.name = payload.name;
//     user.email = payload.email;
//     user.picture = payload.picture;
//   }
//   verify()
//     .then(() => {
//       req.user = user;
//       next();
//     })
//     .catch(err => {
//       res.redirect('/login')
//     })
// }
//===================================================================

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
