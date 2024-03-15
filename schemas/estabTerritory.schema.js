const mongoose = require('mongoose');

const estabTerritorySchema = mongoose.Schema({
    name: String,
    image: String,
    latitud: String,
    longitud: String,
    location: String,
    userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true },
);

module.exports = estabTerritorySchema;
