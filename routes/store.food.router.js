const express = require('express');
const Router = express.Router();
const StoreFoodService = require('../services/store.food.service');
const service = new StoreFoodService();

Router.get('/', async (req, res, next) => {
  try {
    const result = await service.find();
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
});

Router.get('/:id', async (req, res, next) => {
  try {
    const result = await service.findOne(req.params.id);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
});

Router.post('/', async (req, res, next) => {
  try {
    const result = await service.create(req.body);
    res.status(201).json({ data: result });
  } catch (e) {
    next(e);
  }
});

Router.put('/:id', async (req, res, next) => {
  try {
    const result = await service.update(req.params.id, req.body);

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

Router.delete('/:id', async (req, res, next) => {
  try {
    const result = await service.delete(req.params.id);

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = Router;
