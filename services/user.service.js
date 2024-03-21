const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('../config/config');
const User = require('../schemas/user.schema');

class UserService {
  async login(phone, password) {
    const user = await User.findOne({
      phone,
    }).exec();

    if (!user) {
      throw boom.unauthorized();
    }

    const match = await bcrypt.compare(password, user?.password);

    if (!match) {
      throw boom.unauthorized();
    }

    const payload = {
      sub: user._id,
    };

    return jwt.sign(payload, config.jwtSecret);
  }

  async store(userData) {
    const passwordCrypt = await bcrypt.hash(userData.password, 10);
    // Example Status {
    //   name: 'store',
    //   value: false,
    //   userEdit,
    // }
    // userData.status = [];
    const user = new User({ ...userData, password: passwordCrypt });
    await user.save();

    return user;
  }

  async find() {
    return await User.find()
      .populate({
        path: 'roles',
        model: 'roles',
        populate: {
          path: 'permissions',
          model: 'permissions',
        },
      })
      .exec();
  }

  async update(id, data) {
    const user = await User.findOneAndUpdate({ _id: id }, data).exec();

    return user;
  }

  async getAllTokenNotification() {
    return await User.find(
      { tokenNotification: { $ne: null } },
      'tokenNotification',
    ).exec();
  }

  async findEpecific() {
    return await User.find(
      {},
      'name nickname lastname motherlastnamez phone email image status roles',
    )
      .populate({
        path: 'roles',
        model: 'roles',
        populate: {
          path: 'permissions',
          model: 'permissions',
        },
      })
      .exec();
  }

  // Sustituye a selectUser ya tiene el populate
  async getProfile(id) {
    return await User.findOne({ _id: id })
      .populate({
        path: 'roles',
        model: 'roles',
        populate: {
          path: 'permissions',
          model: 'permissions',
        },
      })
      .populate({
        path: 'stores.food.store',
        model: 'storesfood',
      })
      .populate({
        path: 'stores.food.userEdit',
        model: 'user',
      })
      .populate({
        path: 'member.idMember',
        model: 'members',
      })
      .exec();
  }

  // ACTUALIZAR CONTRASEÑA DEL USUARIO
  async updateCurrentPass(idUser, data) {
    const session = await User.startSession();
    await session.startTransaction();
    try {
      //VALIDA EL USUARIO
      const user = await User.findOne({
        _id: idUser,
      }).exec();

      //COMPARA LA CONTRASEÑA ENCRIPTADA
      const passCompare = await bcrypt.compare(data.currentPass, user.password);
      if (user && passCompare) {
        //ENCRIPTACION DE CONTRASEÑÁ
        const saltRounds = 10;
        const hashPass = await bcrypt.hash(data.newPass, saltRounds);

        await User.updateOne({ _id: idUser }, { password: hashPass }); // CAMBIAR POR hashPass
        await session.commitTransaction();

        return true;
      }
      await session.commitTransaction();
      return false;
    } catch (err) {
      await session.abortTransaction();
      return false;
    } finally {
      await session.endSession();
    }
  }

  async selectUser(idUser) {
    const user = await User.findOne({ _id: idUser }).exec();
    return user;
  }

  async updateUser(idUser, data) {
    const session = await User.startSession();
    await session.startTransaction();

    try {
      //ACTUALIZAR USUARIO
      await User.updateOne(
        { _id: idUser },
        {
          name: data.name,
          lastname: data.lastname,
          motherlastname: data.motherlastname,
          email: data.email,
          phonecode: data.phonecode,
          country: data.country,
          state: data.state,
          city: data.city,
          sex: data.sex,
          age: data.age,
          image: data.image,
        },
        { session },
      );
      await session.commitTransaction();
      return true;
    } catch (err) {
      await session.abortTransaction();
      return fasle;
    } finally {
      await session.endSession();
    }
  }

  async upDatePhone(idUser, phone, phonecode) {
    const session = await User.startSession();
    await session.startTransaction();
    try {
      await User.updateOne(
        { _id: idUser },
        {
          phone: phone,
          phonecode: phonecode,
        },
        { session },
      );
      await session.commitTransaction();
      return true;
    } catch (err) {
      await session.abortTransaction();
      return fasle;
    } finally {
      await session.endSession();
    }
  }

  async updateStatus(userEdit, data) {
    const status = {
      name: data.module,
      value: data.value,
      userEdit: userEdit,
    };

    let result = await User.updateOne(
      { _id: data.idUser, 'status.name': data.module },
      { $set: { 'status.$': status } },
    );

    if (result.modifiedCount === 0) {
      result = await User.updateOne(
        { _id: data.idUser },
        { $addToSet: { status: status } },
      );
    }
    return result;
  }

  async findById(id) {
    return this.getProfile(id);
  }
}

module.exports = UserService;
