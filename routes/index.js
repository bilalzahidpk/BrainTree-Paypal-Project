require('dotenv').config();

const express = require('express');

const router = express.Router();

const paymentController = require('../controllers/index');

router.get('/', (req, res, next) =>
  res.render('index', { pageTitle: 'Payment', clientId: process.env.CLIENT_ID })
);

router.post('/', paymentController.generatePayment);

module.exports = router;
