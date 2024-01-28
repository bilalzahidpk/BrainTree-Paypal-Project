require('dotenv').config();

const axios = require('axios');
const crypto = require('crypto');

const { convertDateFormat } = require('./date');

const createPaypalPayment = async (formData) => {
  try {
    const { customerName, cardNumber, currency, cvc } = formData;
    const price = formData.price + '.00';
    const expiryDate = convertDateFormat(formData.expiryDate);
    const requestId = crypto.randomBytes(16).toString('hex');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString('base64'),
        'PayPal-Request-Id': requestId,
      },
    };

    const data = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: 'T-Shirt',
              description: 'Green XL',
              quantity: '1',
              unit_amount: {
                currency_code: currency,
                value: price,
              },
            },
          ],
          amount: {
            currency_code: currency,
            value: price,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: price,
              },
            },
          },
        },
      ],
      payment_source: {
        card: {
          name: customerName,
          number: cardNumber,
          security_code: cvc,
          expiry: expiryDate,
        },
      },
    };

    const response = await axios.post(
      process.env.PAYPAL_PAYMENT_URL,
      data,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createPaypalPayment,
};
