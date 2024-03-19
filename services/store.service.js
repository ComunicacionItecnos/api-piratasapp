const mongoose = require('mongoose');
const boom = require('@hapi/boom');
const storeSchema = require('../schemas/store.schema');
const model = mongoose.model('store', storeSchema);

const modelUser = require('../schemas/user.schema');
const roles = require('../schemas/role.schema');


class StoreService {
  async findAllStore() {
    const result = await model.find({}).exec();
    return await result;
  }

  async newStore(data, idUser) {
    data.userEdit = idUser;
    const result = await new model({ ...data });
    await result.save();
    return await result;
  }

  async findByName(name) {
    const result = await model.find({ "name": name }).exec();
    return await result;
  }

  async findNoEmployees(role = "user") {
    let match = {
      "roles.name": role,
      "status": { $not: { $elemMatch: { "name": "store", "value": false } } },
      $or: [
        { "status.name": { $ne: "store" } },
        { "status": { $exists: false } },
        { "status": { $elemMatch: { "name": "store", "value": true } } }
      ]
    };

    const result = await modelUser.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles'
        }
      },
      {
        $match: match
      },
      {
        $project: {
          name: 1,
          nickname: 1,
          lastname: 1,
          motherlastname: 1,
          phone: 1,
          email: 1,
          image: 1,
        }
      }
    ]);
    
    return result;
  }

  async addStoreToUser(data, idUserEdit) {
    const session = await model.startSession();
    session.startTransaction();
    try {
      const idUser = data.idUser;
      const findRole = await roles.findOne({ "name": "employeeStore" });
      const findRoleUser = await roles.findOne({ "name": "user" });


      if (data.stores && data.stores.length > 0) {
        for (const store of data.stores) {
          const newRegister = {
            store: store.idStore,
            value: store.value,
            userEdit: idUserEdit
          }
          const res = await modelUser.find({ "_id": idUser });
          const markets = res[0].stores.market;
          const find = markets.find(element => element.store == store.idStore);

          if (find) {
            await modelUser.updateOne({ "_id": idUser, "stores.market.store": store.idStore }, { $set: { "stores.market.$": newRegister } });
          } else {
            await modelUser.updateOne({ "_id": idUser }, { $addToSet: { "stores.market": newRegister } });
          }
        }
      }

      const findMarket = await modelUser.findOne({ "_id": idUser }, 'stores');

      const find = findMarket.stores.market.find(element => element.value == true);


      if (find) {
        const upDateRol = await modelUser.updateOne({ "_id": idUser }, { $set: { "roles": findRole._id } });
        await session.commitTransaction();
        session.endSession();
        return upDateRol;
      } else {
        const upDateRol = await modelUser.updateOne({ "_id": idUser }, { $set: { "roles": findRoleUser._id } });
        await session.commitTransaction();
        session.endSession();
        return upDateRol;
      }
    }
    catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw boom.badRequest(error);
    }
  }
}

module.exports = StoreService;
