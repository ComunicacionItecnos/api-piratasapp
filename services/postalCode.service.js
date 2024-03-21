const PostalCodeSchema = require('../schemas/postalCode.schema');

class PostalCodeService {
  async find(state, city, cp) {
    const cps = await PostalCodeSchema.find({
      estado: {
        $regex: new RegExp(state, 'i'),
      },
      ciudad: {
        $regex: new RegExp(city, 'i'),
      },
      // codigo_postal: {
      //   $regex: new RegExp(cp),
      // },
    }).exec();

    return cps;
  }

  async findStates() {
    const states = await PostalCodeSchema.distinct('estado').exec();

    return states;
  }

  async findStatesForCity(state) {
    const cities = await PostalCodeSchema.find({ estado: state })
      .distinct('municipio')
      .exec();

    return cities;
  }
}

module.exports = PostalCodeService;
