const mongoose = require('mongoose');
const schedule = require('node-schedule');
const boom = require('@hapi/boom');
const orderSchema = require('../schemas/order.schema');
const productSchema = require('../schemas/product.schema');
const { encrypt, decrypt } = require('../utils/crypt/index');
const { sendNotification } = require('../utils/notifications/index');

const model = mongoose.model('order', orderSchema);
const productModel = mongoose.model('product', productSchema);

class OrderService {
  async newOrder(data, idUser) {
    data.status = 'Pendiente';
    data.statusNote = 'Pendiente de confirmación';

    const session = await model.startSession();
    await session.startTransaction();
    try {
      const idStore = data.store.idStore;
      const deliveryKeyEncrypted = encrypt(data.deliveryKey);
      data.deliveryKey = JSON.stringify(deliveryKeyEncrypted);
      data.userEdit = idUser;
      data.userOrder.user = idUser;
      data.store = idStore;
      let date = new Date();
      data.deliveryDate = date.setDate(date.getDate() + 3);
      data.confirmationDate = date.setDate(date.getDate() - 2);

      const order = await new model({ ...data });
      await order.save();

      for (const product of data.products) {
        const idProduct = product.idProduct;
        const amount = product.amount;
        //BUSCAR STOCK
        const findStock = await productModel.findOne(
          { _id: idProduct, 'stores.store': idStore },
          { 'stores.$': 1 },
        );

        //SI NO HAY STOCK
        if (findStock.stores[0].stock < amount) {
          throw new Error('No hay suficiente stock');
        } else {
          await productModel.updateOne(
            { _id: idProduct, 'stores.store': idStore },
            { $inc: { 'stores.$.stock': -amount } },
          );
        }
      }

      await session.commitTransaction();
      session.endSession();
      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw boom.badRequest(error);
    }
  }

  async findUser(idUser) {
    let result = await model
      .find({ 'userOrder.user': idUser })
      .select({
        _id: 1,
        createdAt: 1,
        total: 1,
        status: 1,
        deliveryDate: 1,
        deliveryKey: 1,
        store: 1, // Assuming the field that references the store is named 'store'
      })
      .populate('store', ['name'])
      .sort({ createdAt: -1 });

    result = result.map((item) => {
      const deliveryKeyObject = JSON.parse(item.deliveryKey);
      item.deliveryKey = decrypt(deliveryKeyObject);
      return item;
    });

    return result;
  }

  async find(idOrder) {
    const result = await model
      .findOne({ _id: idOrder })
      .populate('store userOrder.user userEdit.idUser products.idProduct');

    const deliveryKeyObject = JSON.parse(result.deliveryKey);
    result.deliveryKey = decrypt(deliveryKeyObject);
    return await result;
  }

  async updateStatus(data, userLogged) {
    if (data.status === 'Cancelado por cliente') {
      data.statusNote = 'Cancelado por el cliente';
    } else if (data.status === 'Entregado') {
      data.statusNote = 'Pedido entregado al cliente';
      const payload = {
        notification: {
          title: '¡Gracias por tu compra!',
          body: 'Ya has recogido tu pedido',
        },
      };
      const notificationSended = sendNotification([data.clientToken], payload);
    } else if (data.status === 'En curso') {
      data.statusNote = 'Pedido confirmado';
      const payload = {
        notification: {
          title: '¡Tu pedido ha sido confirmado!',
          body: 'Tienes dos días para recogerlo, consulta tu ticket en la app',
        },
      };
      const notificationSended = sendNotification([data.clientToken], payload);
    } else if (data.status === 'Cancelado por la tienda') {
      const payload = {
        notification: {
          title: '¡Lo sentimao tu pedido no ha sido aprobado!',
          body: data.statusNote,
        },
      };
      const notificationSended = sendNotification([data.clientToken], payload);
    }

    const idOrder = data.idOrder;
    const status = data.status;
    const statusNote = data.statusNote;

    const session = await model.startSession();
    await session.startTransaction();
    try {
      if (
        status === 'Cancelado por cliente' ||
        status === 'Cancelado por la tienda'
      ) {
        if (data.products && data.idStore) {
          for (const product of data.products) {
            const idProduct = product.idProduct._id;
            const amount = product.amount;
            await productModel.updateOne(
              { _id: idProduct, 'stores.store': data.idStore },
              { $inc: { 'stores.$.stock': amount } },
            );
          }
        }
      }
      const result = await model.updateOne(
        { _id: idOrder },
        {
          $set: {
            status: status,
            statusNote: statusNote,
            userEdit: userLogged,
          },
        },
      );

      await session.commitTransaction();
      session.endSession();
      return result;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw boom.badRequest(error);
    }
  }

  async findAll(idStore) {
    let condition = {};
    if (idStore === 'all') {
      condition = {};
    } else {
      condition = { store: new mongoose.Types.ObjectId(idStore) };
    }

    const result = await model
      .find(condition, {
        ' _id': 1,
        deliveryDate: 1,
        status: 1,
        total: 1,
        store: 1,
        userOrder: {
          name: 1,
          lastname: 1,
          motherLastname: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .populate('store userOrder.user');

    return await result;
  }

  async incStock(idProduct, idStore, amount) {
    const result = await productModel.updateOne(
      { _id: idProduct, 'stores.store': idStore },
      { $inc: { 'stores.$.stock': amount } },
    );
    return await result;
  }
}

// Función para actualizar el estado de las órdenes vencidas
async function upDateStatusDelivery() {
  const session = await model.startSession();
  await session.startTransaction();
  try {
    const payload = {
      notification: {
        title: '¡Parece que no has recogido tu pedido!',
        body: 'Recuerda que puedes cancelar la orden desde la aplicación',
      },
    };

    const currentDate = new Date();
    const ordersCancel = await model
      .find({
        deliveryDate: { $lte: currentDate },
        status: { $in: ['En curso'] },
      })
      .populate('store userOrder.user userEdit.idUser products.idProduct');

    for (const orden of ordersCancel) {
      const idStore = orden.store;
      orden.status = 'Cancelado sin entrega'; // Actualizar el estado según tus necesidades
      orden.statusNote = 'El cliente no recogió el producto';

      const notificationSended = sendNotification(
        [orden.userOrder.user.notificationToken],
        payload,
      );

      for (const product of orden.products) {
        const idProduct = product.idProduct;
        const amount = product.amount;
        await productModel.updateOne(
          { _id: idProduct, 'stores.store': idStore },
          { $inc: { 'stores.$.stock': amount } },
        );
      }
      await orden.save();
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.error('Error al actualizar estados de órdenes vencidas:', error);
    await session.abortTransaction();
    session.endSession();
  }
}

// Función para actualizar el estado de las órdenes no constestadas
async function upDateStatusConfirm() {
  const session = await model.startSession();
  await session.startTransaction();
  try {
    const payload = {
      notification: {
        title: '¡Lo sentimos tu pedido no ha sido aprobado!',
        body: 'El producto está disponible en otras tiendas',
      },
    };

    const currentDate = new Date();
    const ordersCancel = await model
      .find({
        confirmationDate: { $lte: currentDate },
        status: { $in: ['Pendiente'] },
      })
      .populate('store userOrder.user userEdit.idUser products.idProduct');

    for (const orden of ordersCancel) {
      const idStore = orden.store;
      orden.status = 'Cancelado sin confirmación'; // Actualizar el estado según tus necesidades
      orden.statusNote = 'El vendedor no confirmó la orden';

      const notificationSended = sendNotification(
        [orden.userOrder.user.notificationToken],
        payload,
      );

      for (const product of orden.products) {
        const idProduct = product.idProduct;
        const amount = product.amount;
        await productModel.updateOne(
          { _id: idProduct, 'stores.store': idStore },
          { $inc: { 'stores.$.stock': amount } },
        );
      }
      await orden.save();
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.error('Error al actualizar estados de órdenes:', error);
    await session.abortTransaction();
    session.endSession();
  }
}

// Programar la tarea para que se ejecute diariamente
// '0 = minutos 0 = horas *** = todos los dias de todos los meses de todo el año'
schedule.scheduleJob('0 0 * * *', () => {
  upDateStatusDelivery();
  upDateStatusConfirm();
});

module.exports = OrderService;
