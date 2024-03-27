const express = require('express');
const Router = express.Router();
const config = require('../config/config');
const boom = require('@hapi/boom');
const Stripe = require('stripe');
const stripe = Stripe(config.stripeSecretKey);

Router.get('/verify-payment/:paymentIntentId', async (req, res, next) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({ status: paymentIntent });
  } catch (err) {
    next(err);
  }
});

Router.post('/payment', async (req, res, next) => {
  try {
    const intent = req.body;

    const paymentIntent = await stripe.paymentIntents.create(intent);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 239 * 1000,
    //   currency: 'MXN',
    //   payment_method_types: ['card'],
    //   metadata: { name: 'Bryan Saladino' },
    // });

    const { client_secret: clientSecret, id: paymentIntentId } = paymentIntent;

    res.status(200).json({ clientSecret, paymentIntentId });
  } catch (err) {
    next(err);
  }
});

module.exports = Router;
