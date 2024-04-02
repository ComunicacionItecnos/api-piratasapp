const express = require('express');
const Router = express.Router();
const passport = require('passport');

const UserService = require('../services/user.service');
const service = new UserService();

Router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.status(200).json({ data: users });
    } catch (err) {
      next(err);
    }
  },
);

Router.post('/signin', async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const result = await service.login(phone, password);
    // res.cookie('token', result, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'none',
    // });
    res.status(200).json({ token: result });
  } catch (e) {
    next(e);
  }
});

Router.post('/signup', async (req, res, next) => {
  try {
    const result = await service.store({ ...req.body });
    return res.status(201).json({ data: result });
  } catch (e) {
    next(e);
  }
});

Router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { sub: id } = req.user;
      const profile = await service.getProfile(id);
      res.status(200).json({ data: profile });
    } catch (err) {
      next(err);
    }
  },
);

// Router.get(
//   '/user',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res, next) => {
//     try {
//       const result = await service.selectUser(req.user.sub);
//       return res.status(201).json({ result });
//     } catch (e) {
//       next(e);
//     }
//   },
// );
Router.patch(
  '/update',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const result = await service.updateUser(req.user.sub, { ...req.body });
      return res.status(201).json({ result });
    } catch (e) {
      next(e);
    }
  },
);

Router.patch(
  '/password',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const result = await service.updateCurrentPass(req.user.sub, {
        ...req.body,
      });
      return res.status(201).json({ result });
    } catch (e) {
      next(e);
    }
  },
);

//Actualiza el status del usuario
Router.patch(
  '/status',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const data = await service.updateStatus(req.user.sub, { ...req.body });
      return res.status(201).json({ data });
    } catch (e) {
      next(e);
    }
  },
);

Router.patch(
  '/phone',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const data = req.body;
    try {
      const result = await service.upDatePhone(
        req.user.sub,
        data.phone,
        data.phonecode,
      );
      return res.status(201).json({ result });
    } catch (e) {
      next(e);
    }
  },
);

Router.get(
  '/find',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const users = await service.findEpecific();
      res.status(200).json({ data: users });
    } catch (err) {
      next(err);
    }
  },
);

Router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const result = await service.update(req.user.sub, req.body);
      return res.status(201).json({ data: result });
    } catch (e) {
      next(e);
    }
  },
);

Router.get(
  '/findById/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { userId } = req.params;

    try {
      const users = await service.findById(userId);
      res.status(200).json({ data: users });
    } catch (err) {
      next(err);
    }
  },
);

Router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = await service.delete(req.user.sub);
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = Router;
