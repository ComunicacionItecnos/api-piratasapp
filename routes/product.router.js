const express = require('express');
const router = express.Router();
const ProductService = require('../services/product.service');
const service = new ProductService();

router.post('/create', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.new({ ...req.body }, idUser);
    res.status(200).json({ data: response }); // REGISTRAR  NUEVO PRODUCTO
  } catch (e) {
    next(e);
  }
});

router.get('/find/active', async (req, res, next) => {
  try {
    const response = await service.findAllActive(); // ENLISTA TODOS LOS PRODUCTOS
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/find/:idProd', async (req, res, next) => {
  const idProd = req.params.idProd;
  try {
    const response = await service.findActive(idProd); // INFORMACION DE UN PRODUCTO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/find/store/:idProduct/:nameStore', async (req, res, next) => {
  const idProduct = req.params.idProduct;
  const nameStore = req.params.nameStore;
  try {
    const response = await service.findInStore(idProduct, nameStore); // BUSCA UN PRODUCTO EN UNA TIENDA
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

//PANEL DE ADMINISTRADOR
router.get('/findall', async (req, res, next) => {
  try {
    const data = await service.findAll(); // ENLISTA TODOS LOS PRODUCTOS
    res.status(200).json({ data: data });
  } catch (e) {
    next(e);
  }
});

router.get('/findall/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await service.findProdStores(id); // ENLISTA TODOS LOS PRODUCTOS
    res.status(200).json({ data: data });
  } catch (e) {
    next(e);
  }
});

router.get('/findid/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await service.findId(id); // ENLISTA TODOS LOS PRODUCTOS
    res.status(200).json({ data: data });
  } catch (e) {
    next(e);
  }
});

router.delete('/delete/', async (req, res, next) => {
  const idProduct = req.query.idProduct;
  try {
    const response = await service.del(idProduct); // ELIMINA UN PRODUCTO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.patch('/update/stock', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.updateStock({...req.body}, idUser); // ELIMINA UN PRODUCTO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.patch('/update/product', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.updateProduct({...req.body}, idUser); // ELIMINA UN PRODUCTO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
