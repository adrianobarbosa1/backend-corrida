import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import eventRoute from './event.route';
import teamRoute from './team.route';
import athleteRoute from './athlete.route';
import dependetsRoute from './dependets.route';
import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoute },
  { path: '/event', route: eventRoute },
  { path: '/athlete', route: athleteRoute },
  { path: '/team', route: teamRoute },
  { path: '/dependents', route: dependetsRoute },
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
