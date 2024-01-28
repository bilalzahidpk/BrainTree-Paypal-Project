const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    expiryDateTime: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model('Token', tokenSchema);
