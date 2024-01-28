const creditCardType = require('credit-card-type');

const { createPaypalPayment } = require('../config/paypal');
const { createBraintreePayment } = require('../config/braintree');
const { encryptData } = require('../config/crypto');

const Order = require('../models/order');

const generateOrder = async (data, response, paymentType) => {
  const encryptedResponse = encryptData(JSON.stringify(response));
  const order = new Order({
    customerName: data.customerName,
    price: parseInt(data.price, 10),
    currency: data.currency,
    paymentType: paymentType,
    response: encryptedResponse,
  });
  return order;
};

exports.generatePayment = async (req, res, next) => {
  try {
    const data = req.body;
    const cardType = creditCardType(data.cardNumber)[0].type;

    if (cardType == 'american-express' && data.currency !== 'USD') {
      throw Error(
        'American Express can not be used with currency other than USD'
      );
    } else if (
      cardType === 'american-express' ||
      ['USD', 'EUR', 'AUD'].includes(data.currency)
    ) {
      const response = await createPaypalPayment(data);

      if (response.status !== 'COMPLETED') {
        throw Error(response.message);
      }
      const order = await generateOrder(data, response, 'Paypal');
      order.save();
      req.flash(
        'success_alert_message',
        `You have successfully paid ${data.price} ${data.currency} using Paypal`
      );
      res.redirect(303, '/');
    } else {
      const response = await createBraintreePayment(data);

      if (!response.success) {
        throw Error(response.message);
      }
      const order = await generateOrder(data, response, 'Braintree');
      order.save();
      req.flash(
        'success_alert_message',
        `You have successfully paid ${data.price} ${data.currency} using Braintree`
      );
      res.redirect(303, '/');
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
