const express = require('express');
const router = express.Router();
const TerritoryServices = require('../services/territory.service');
const service = new TerritoryServices();

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



module.exports = router;
