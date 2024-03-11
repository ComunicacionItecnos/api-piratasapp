const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsRouter = require('./post.router');
const userRouter = require('./user.router');
const storeRouter = require('./store.router');
const orderRouter = require('./order.router');
const productRouter = require('./product.router');
const newsRouter = require('./news.router');
const playerRouter = require('./roster.router');
const postalCodeRouter = require('./postalCode.router');
const storeFoodRouter = require('./store.food.router');
const productFoodRouter = require('./product.food.router');
const orderFoodRouter = require('./order.food.router');
const countryRouter = require('./country.router');
const roleRouter = require('./role.router');
const permissionRouter = require('./permission.router');
const memberRouter = require('./member.router');
const seatRouter = require('./seat.router');
const { userStatus } = require('../middlewares/statuspost.handler');

const routerApi = (app) => {
  app.use('/api/v1', router);
  router.use('/users', userRouter);

  router.use(
    '/posts',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => userStatus(req, res, next, { search: 'posts' }),
    postsRouter,
  );

  router.use(
    '/order',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => userStatus(req, res, next, { search: 'store' }),
    orderRouter,
  );

  router.use(
    '/store',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => userStatus(req, res, next, { search: 'store' }),
    storeRouter,
  );

  router.use(
    '/product',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => userStatus(req, res, next, { search: 'store' }),
    productRouter,
  );

  router.use(
    '/members',
    passport.authenticate('jwt', { session: false }),
    memberRouter,
  );

  router.use(
    '/news',
    passport.authenticate('jwt', { session: false }),
    newsRouter,
  );
  router.use(
    '/players',
    passport.authenticate('jwt', { session: false }),
    playerRouter,
  );
  router.use(
    '/stores-food',
    passport.authenticate('jwt', { session: false }),
    storeFoodRouter,
  );
  router.use(
    '/products-food',
    passport.authenticate('jwt', { session: false }),
    productFoodRouter,
  );
  router.use(
    '/orders-food',
    passport.authenticate('jwt', { session: false }),
    orderFoodRouter,
  );
  router.use(
    '/seats',
    passport.authenticate('jwt', { session: false }),
    seatRouter,
  );
  router.use(
    '/roles',
    passport.authenticate('jwt', { session: false }),
    roleRouter,
  );
  router.use(
    '/permissions',
    passport.authenticate('jwt', { session: false }),
    permissionRouter,
  );
  router.use(
    '/countries',
    passport.authenticate('jwt', { session: false }),
    countryRouter,
  );
  router.use('/postal-codes', postalCodeRouter);
};

module.exports = routerApi;
