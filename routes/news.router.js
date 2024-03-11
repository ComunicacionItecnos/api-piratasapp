const express = require('express');
const router = express.Router();

const NewsService = require('../services/news.service');
const service = new NewsService();

const UserService = require('../services/user.service');
const serviceUser = new UserService();

const { sendNotification } = require('../utils/notifications');

router.get('/', async (req, res, next) => {
  try {
    const news = await service.find();
    res.status(200).json({ data: news });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const news = await service.findOne(req.params.id);
    res.status(200).json({ data: news });
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const article = await service.create({
      ...req.body,
      createBy: req.user.sub,
    });

    req.app.io.emit('articles', article);

    // Obtener token de todos los usuarios
    const users = await serviceUser.find();
    const filter = users.filter((user) => user.notificationToken !== '');
    const tokens = filter.map((user) => user.notificationToken);

    // Ejemplo de uso
    const registrationToken = tokens;
    const payload = {
      notification: {
        title: req.body.title,
        body: req.body.article,
      },
    };

    sendNotification(registrationToken, payload);

    res.status(201).json({ data: article });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const result = await service.update(req.params.id, { ...req.body });
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await service.delete(req.params.id);

    req.app.io.emit('articles', result);

    res.status(201).json({ data: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
