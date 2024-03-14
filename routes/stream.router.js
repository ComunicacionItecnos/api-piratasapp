const express = require('express');
const router = express.Router();
const StreamServices = require('../services/stream.service');
const service = new StreamServices();

router.get('/', async (req, res, next) => {
    const idUser = req.user.sub;
    try {
        const response = await service.find(idUser); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.get('/:idStream', async (req, res, next) => {
    const idUser = req.user.sub;

    try {
        const response = await service.findById(idUser,req.params.idStream); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    const idUser = req.user.sub;
    try {
        const response = await service.create({ ...req.body }, idUser); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.post('/addLike', async (req, res, next) => {
    const idUser = req.user.sub;
    try {
        const response = await service.addLike({ ...req.body }, idUser); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

router.delete('/deleteLike/:idStream', async (req, res, next) => {
    const idUser = req.user.sub;
    try {
        const response = await service.deleteLike(req.params.idStream, idUser); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});


router.delete('/delete/:idStream', async (req, res, next) => {
    try {
        const response = await service.delete(req.params.idStream); // ENLISTA TODAS LAS TIENDAS
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
