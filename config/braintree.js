require('dotenv').config();

const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const generateToken = async (req, res, next) => {
  try {
    const response = await gateway.clientToken.generate();
    const token = response.clientToken;
    return token;
  } catch (err) {
    throw err;
  }
};

const createBraintreePayment = async (formData) => {
  try {
    const { customerName, cardNumber, currency, cvc, expiryDate } = formData;

    let price = formData.price + '.00';

    const payment = await gateway.transaction.sale({
      amount: price,
      creditCard: {
        cardholderName: customerName,
        cvv: cvc,
        expirationDate: expiryDate,
        number: cardNumber,
      },
    });
    return payment;
  } catch (err) {
    throw err;
  }
};

module.exports = { createBraintreePayment };
