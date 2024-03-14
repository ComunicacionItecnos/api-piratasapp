const mongoose = require('mongoose');

const streamSchema = mongoose.Schema({
    name: String,
    uri: String,
    status: Boolean,
    likes: [
        {
            idUser: String
        }
    ],
    userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true },
);

module.exports = streamSchema;
