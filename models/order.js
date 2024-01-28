const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model('Order', orderSchema);
