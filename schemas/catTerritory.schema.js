const mongoose = require('mongoose');

const categoryTerritorySchema = mongoose.Schema({
    name: String,
    image: String,
    userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true },
);

module.exports = categoryTerritorySchema;
