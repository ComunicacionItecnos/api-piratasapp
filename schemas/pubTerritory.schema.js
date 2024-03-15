const mongoose = require('mongoose');

const pubTerritorySchema = mongoose.Schema({
    name: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'catterritory' },
    description: String,
    publicityText: String,
    publicityLevel: String,
    establishments: [
        {idEstab: { type: mongoose.Schema.Types.ObjectId, ref: 'estabterritory' }}
    ],
    userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true },
);

module.exports = pubTerritorySchema;
