const mongoose = require('mongoose');

const uriSchema = mongoose.Schema({
    uri: String,
    name: String,
},  { timestamps: true });

module.exports = uriSchema;
