const express = require('express');
const router = express.Router();
const TerritoryServices = require('../services/territory.service');
const service = new TerritoryServices();
//CATEGORY
router.get('/category', async (req, res, next) => {
    try {
        const response = await service.findCategory(); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.post('/category', async (req, res, next) => {
    const idUser = req.user.sub;
    try {
        const response = await service.createCategory({ ...req.body }, idUser); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});


//ESTABLISHMENT
router.get('/estab', async (req, res, next) => {
    try {
        const response = await service.findStabs(); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.post('/estab', async (req, res, next) => {
    const idUser = req.user.sub;
    try {
        const response = await service.createStab({ ...req.body }, idUser); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.patch('/estab', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
      const response = await service.updateStab({ ...req.body }, idUser); // ENLISTA TODAS LAS TIENDAS
      res.status(200).json({ data: response });
  } catch (e) {
      next(e);
  }
});

router.delete('/estab/:idStab', async (req, res, next) => {
    const { idStab } = req.params;
    try {
        const response = await service.delStab(idStab); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

//PUBLICITY
router.get('/publishment', async (req, res, next) => {
    try {
        const response = await service.find(); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.get('/publishment/:idPub', async (req, res, next) => {
    const { idPub } = req.params;
    try {
        const response = await service.findID(idPub); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.get('/publishment/cat/:idCategory', async (req, res, next) => {
  const { idCategory } = req.params;
  try {
      const response = await service.findByCategory(idCategory); // ENLISTA TODAS LAS TIENDAS
      res.status(200).json({ data: response });
  } catch (e) {
      next(e);
  }
});

router.post('/publishment', async (req, res, next) => {
    const idUser = req.user.sub;
    try {
        const response = await service.create({ ...req.body }, idUser); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.patch('/publishment', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
      const response = await service.updatePromo({ ...req.body }, idUser); // ENLISTA TODAS LAS TIENDAS
      res.status(200).json({ data: response });
  } catch (e) {
      next(e);
  }
});

router.delete('/publishment/:idPub', async (req, res, next) => {
    const { idPub } = req.params;
    try {
        const response = await service.delete(idPub); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});


module.exports = router;
