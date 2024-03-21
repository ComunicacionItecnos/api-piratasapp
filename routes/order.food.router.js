const express = require('express');
const router = express.Router();

const OrderFoodService = require('../services/order.food.service');
const service = new OrderFoodService();

const UserService = require('../services/user.service');
const serviceUser = new UserService();

const { sendNotification } = require('../utils/notifications/index');

router.get('/find-by-user', async (req, res, next) => {
  try {
    const orders = await service.findByUser(req.user.sub);
    res.status(200).json({ data: orders });
  } catch (e) {
    next(e);
  }
});

router.get('/by-store/:id', async (req, res, next) => {
  try {
    const orders = await service.findByStore(req.params.id, req.query.date);
    res.status(200).json({ data: orders });
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const order = await service.update(req.params.id, req.body);

    if (req.body.status === 'prepared') {
      order.deliveryTime = req.body.deliveryTime;
    }
    order.status = req.body.status;

    req.app.io.emit('orders', order);

    const usuarios = await serviceUser.find();
    const user = usuarios.filter(
      (user) => user._id.toString() === req.body.user._id.toString(),
    );

    if (req.body.status === 'ready') {
      const payload = {
        notification: {
          title: '¡Pedido listo!',
          body: 'Tu pedido ya está listo para ser recodigo o enviado',
        },
      };

      sendNotification([user[0].notificationToken], payload);
    }

    res.status(201).json({ data: order });
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;

    const order = await service.create({ ...data, user: req.user.sub });

    req.app.io.emit('orders', order);

    res.status(201).json({ data: order });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
