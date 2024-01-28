require('dotenv').config();

const request = require('supertest');
const crypto = require('crypto');
const creditCardType = require('credit-card-type');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createServer } = require('./server.js');

const app = createServer();

const indexController = require('./controllers/index');
const { createPaypalPayment } = require('./config/paypal');
const { createBraintreePayment } = require('./config/braintree');

const Order = require('./models/order');

jest.mock('credit-card-type');
jest.mock('./config/paypal');
jest.mock('./config/braintree');
jest.mock('./models/order');

let mongod;

describe('POST /', () => {
  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    await mongod.start();
    const mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongod.stop();
  });
  describe('Required Cases in File', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('Should respond 302 with Amex cards with currency specified other than USD', async () => {
      creditCardType.mockReturnValue([{ type: 'visa' }]);

      const response = await request(app).post('/').send({
        customerName: '123',
        price: '100',
        currency: 'EUR',
        cardNumber: '343211332785269',
        cvc: '6726',
        expiryDate: '04/27',
      });
      expect(response.statusCode).toBe(302);
    });
    test('If the credit card type is AMEX, then use Paypal', async () => {
      creditCardType.mockReturnValue([{ type: 'american-express' }]);

      createPaypalPayment.mockResolvedValue({ status: 'COMPLETED' });

      const mockOrder = { save: jest.fn() };
      Order.mockReturnValueOnce(mockOrder);

      const req = {
        body: {
          customerName: '123',
          price: '100',
          currency: 'USD',
          cardNumber: '343211332785269',
          cvc: '6726',
          expiryDate: '04/27',
        },
      };
      const res = { redirect: jest.fn() };
      const next = jest.fn();

      await indexController.generatePayment(req, res, next);

      await expect(Order).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentType: 'Paypal',
        })
      );
    });
    test('if currency is EUR then use Paypal', async () => {
      creditCardType.mockReturnValue([{ type: 'visa' }]);

      createPaypalPayment.mockResolvedValue({ status: 'COMPLETED' });

      const mockOrder = { save: jest.fn() };
      Order.mockReturnValueOnce(mockOrder);

      const req = {
        body: {
          customerName: '123',
          price: '100',
          currency: 'EUR',
          cardNumber: '4111111111111111',
          cvc: '676',
          expiryDate: '04/27',
        },
      };
      const res = { redirect: jest.fn() };
      const next = jest.fn();

      await indexController.generatePayment(req, res, next);

      await expect(Order).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentType: 'Paypal',
        })
      );
    });
    test('if currency is not USD, EUR, or AUD use Braintree', async () => {
      creditCardType.mockReturnValue([{ type: 'visa' }]);

      createBraintreePayment.mockResolvedValue({ success: true });

      const mockOrder = { save: jest.fn() };
      Order.mockReturnValueOnce(mockOrder);

      const uniqueCustomerName = crypto.randomBytes(16).toString('hex');
      const req = {
        body: {
          customerName: uniqueCustomerName,
          price: '100',
          currency: 'THB',
          cardNumber: '4111111111111111',
          cvc: '676',
          expiryDate: '04/27',
        },
      };
      const res = { redirect: jest.fn() };
      const next = jest.fn();

      await indexController.generatePayment(req, res, next);

      await expect(Order).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentType: 'Braintree',
        })
      );
    });
  });
});
