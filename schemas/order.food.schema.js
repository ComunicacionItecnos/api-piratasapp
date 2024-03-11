const mongoose = require('mongoose');

const OrderFoodSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'storesfood',
      required: true,
    },
    products: [
      {
        __v: Number,
        _id: String,
        description: String,
        image: String,
        price: Number,
        quantity: Number,
        comment: String,
        storeId: String,
        title: String,
      },
    ],
    deliveryTime: { type: String, default: '' },
    paymentMethod: { type: String },
    row: { type: String },
    seat: { type: String },
    section: { type: String },
    status: { type: String, required: true },
    subtotalPayment: Number,
    totalPayment: { type: Number, required: true },
    securityCode: { type: String, required: true },
    payment: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ordersfood', OrderFoodSchema);
