const mongoose = require('mongoose');
const modelSchema = require('../schemas/member.schema');
const model = mongoose.model('members', modelSchema);
const modelUser = require('../schemas/user.schema');
const boom = require('@hapi/boom');
const schedule = require('node-schedule');

class memberService {
  async find() {
    const result = await model.find().populate({
      path: 'userEdit',
      select: 'name email nickname name lastname motherlastname phone',
    });
    return result;
  }

  async findActive() {
    const result = await model.find({ status: true }).populate({
      path: 'userEdit',
      select: 'name email nickname name lastname motherlastname phone',
    });
    return result;
  }

  async findById(id) {
    let result = await model.findById(id).populate({
      path: 'userEdit',
      select: 'name email nickname name lastname motherlastname phone',
    });

    const existInUser = await modelUser.findOne({ 'member.idMember': id });

    // Convertir el documento a un objeto normal
    result = result.toObject();

    if (existInUser) {
      result.existInUser = true;
    } else {
      result.existInUser = false;
    }

    return result;
  }

  async create(data, idUser) {
    data.userEdit = idUser;
    data.status = true;
    const result = await new model({ ...data });
    await result.save();
    return await result;
  }

  async updateToUser(data, idUser) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const dateAssigned = new Date();
      const member = await model.findOne({ _id: data.idMember });
      dateAssigned.setMonth(dateAssigned.getMonth() + member.periodicity);
      data.endDay = dateAssigned;
      data.userEdit = idUser;
      data.dateUpdate = new Date();

      const result = await modelUser.updateOne(
        { _id: data.idUser },
        { $set: { member: data } },
      );

      session.commitTransaction();
      session.endSession();
      return result;
    } catch (e) {
      session.abortTransaction();
      session.endSession();
      throw boom.badRequest('Error al asignar la membresia');
    }
  }

  async updateMember(data, idUser) {
    const result = await model.updateOne(
      { _id: data._id },
      { $set: { ...data, userEdit: idUser } },
    );
    return result;
  }

  async deleteMember(idMember) {
    const result = await model.deleteOne({ _id: idMember });
    return result;
  }

  async findUsersMembers() {
    const result = await modelUser
      .find(
        {
          member: { $ne: null },
          //_id: { $ne: '65e0ec77e101dcd98c066cf9' },
        },
        'name nickname lastname motherlastname phone email image member',
      )
      .populate({ path: 'member.idMember', select: 'name price' });

    console.log(result.length);
    return result;
  }

  async findUsersNoMembers() {
    const result = await modelUser.find(
      {
        member: null,
        //_id: { $ne: '65e0ec77e101dcd98c066cf9' },
      },
      'name nickname lastname motherlastname phone email image',
    );
    console.log(result.length);
    return result;
  }

  async deleteMemberUser(idUser) {
    const result = await modelUser.updateOne(
      { _id: idUser },
      { $set: { member: null } },
    );
    return result;
  }
}

const findAndDelete = async () => {
  const cancelMemberUser = await modelUser.updateMany(
    { 'member.endDay': { $lte: new Date() } },
    { $set: { member: null } },
  );
  console.log('Cancelados: ', cancelMemberUser.modifiedCount);
};

schedule.scheduleJob('0 0 * * *', () => {
  findAndDelete();
});

module.exports = memberService;
