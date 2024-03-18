const mongoose = require('mongoose');
const categoryTerritorySchema = require('../schemas/catTerritory.schema');
const modelCategory = mongoose.model('catterritory', categoryTerritorySchema);


const estabTerritorySchema = require('../schemas/estabTerritory.schema');
const modelStab = mongoose.model('estabterritory', estabTerritorySchema);

const pubTerritorySchema = require('../schemas/pubTerritory.schema');
const model = mongoose.model('pubterritory', pubTerritorySchema);

class memberService {
  //CATEGORY
  async findCategory() {
    const result = await modelCategory.find().exec();
    return await result
  }

  async createCategory(data, idUser) {
    data.userEdit = idUser;
    const result = await new modelCategory({ ...data });
    await result.save();
    return await result;
  }

  //ESTABLISHMENT
  async createStab(data, idUser) {
    data.userEdit = idUser;
    const result = await new modelStab({ ...data });
    await result.save();
    return await result;
  }

  async findStabs() {
    const result = await modelStab.find().exec();
    return await result
  }

  async delStab(idStab) {
    const result = await modelStab.deleteOne({ _id: idStab });
    return await result;
  }

  //PUBLICITY
  async create(data, idUser) {
    data.userEdit = idUser;
    const result = await new model({ ...data });
    await result.save();
    return await result;
  }

  async find() {
    const result = await
      model.find()
        .populate('category', '_id name')
        .populate('establishments.idEstab', 'name image latitud longitud location')
        .populate('userEdit', '_id name lastname motherlastname phone')
        .sort({ createdAt: -1 })
        .exec();
    return await result
  }

  async findByCategory(idCategory) {
    const result = await
      model.find({ category: idCategory })
        .populate('category', '_id name')
        /* .populate('establishments.idEstab', 'name image latitud longitud location')
        .populate('userEdit', '_id name lastname motherlastname phone') */
        .sort({ createdAt: -1 })
        .exec();
    return await result
  }

  async findID(idPub) {
    const result = await
      model.find({ _id: idPub })
        .populate('category')
        .populate('establishments.idEstab')
        .populate('userEdit')
        .exec();
    return await result
  }

  async delete(idPub) {
    const result = await model.deleteOne({ _id: idPub });
    return await result;
  }

  async updatePromo(data, idUser) {
    const session = await model.startSession();
    await session.startTransaction();
    try {
      const result = await model.updateOne(
        { _id: data.idPromo },
        {
          $set: {
            name: data.name,
            image: data.image,
            category: data.category,
            description: data.description,
            publicityText: data.publicityText,
            publicityLevel: data.publicityLevel,
            establishments: data.establishments,
            userEdit: idUser
          },
        }
      )
      await session.commitTransaction();
      session.endSession();
      return result;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw boom.badRequest(error);
    }
  }


}

module.exports = memberService;
