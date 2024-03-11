const Seat = require('../schemas/seat.schema');

class SeatService {
  async find() {
    const seats = await Seat.find();
    return seats;
  }

  async store(data) {
    const seat = new Seat(data);
    await seat.save();

    return seat;
  }
}

module.exports = SeatService;
