const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: String,
  surname: String,
  motherLastName: String,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
  // nationalityCode: String,
  tshirtNumber: Number,
  birthDay: String,
  position: String,
});

playerSchema.add({
  type: String,
  imageUri: String,
  imageUriStadistics: String,
});

module.exports = mongoose.model('players', playerSchema);
