const express = require('express');
const Router = express.Router();
const SeatService = require('../services/seat.service');
const service = new SeatService();

Router.get('/', async (req, res, next) => {
  try {
    const seats = await service.find();
    res.status(200).json({ data: seats });
  } catch (e) {
    next(e);
  }
});

Router.post('/', async (req, res, next) => {
  try {
    const seat = await service.store(req.body);
    res.status(200).json({ data: seat });
  } catch (e) {
    next(e);
  }
});

module.exports = Router;
