const mongoose = require('mongoose');

const StoreFoodSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  image: String,
  deliveryTime: Number,
  qualify: String,
  deliveryOption: String,
});

StoreFoodSchema.add({
  status: String,
});

module.exports = mongoose.model('storesfood', StoreFoodSchema);
