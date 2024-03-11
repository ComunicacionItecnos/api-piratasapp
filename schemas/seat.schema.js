const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema([
  {
    name: String,
    rows: [
      {
        name: String,
        seats: [
          {
            name: String,
          },
        ],
      },
    ],
  },
]);

module.exports = mongoose.model('Seat', seatSchema);
