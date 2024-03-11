const express = require('express');
const router = express.Router();
const OrderService = require('../services/order.service');
const service = new OrderService();
const passport = require('passport');

router.post('/create/', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.newOrder({ ...req.body }, idUser); // CREA UN NUEVO TICKET
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/find/user', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.findUser(idUser); // ENLISTA TODOS LOS TICKETS
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/find/', async (req, res, next) => {
  const idOrder = req.query.idOrder;
  try {
    const response = await service.find(idOrder); // ENLISTA TODOS LOS TICKETS
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.patch('/update/status', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.updateStatus({ ...req.body }, idUser); // ENLISTA TODOS LOS TICKETS
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/find/all/:idStore', async (req, res, next) => {
  const idStore = req.params.idStore;
  try {
    const response = await service.findAll(idStore); // ENLISTA TODOS LOS TICKETS
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
