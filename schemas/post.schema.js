const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  content: String,
  contentType: String,
  imageContent: String,
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      comment: String,
      createdAt: Date,
      reports: [
        {
          idUser: String,
          reason: String
        }
      ]
    }
  ],
  likes: [
    {
      idUser: String
    }
  ],
  reports: [
    {
      idUser: String,
      reason: String
    }
  ]
}, { timestamps: true });

module.exports = postSchema;
