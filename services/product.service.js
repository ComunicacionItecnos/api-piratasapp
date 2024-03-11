const mongoose = require('mongoose');
const boom = require('@hapi/boom');
const productSchema = require('../schemas/product.schema');
const model = mongoose.model('product', productSchema);

class ProductService {
  async new(data, idUser) {
    data.userEdit = idUser;
    data.priceOld = data.priceCurrent;
    if (data.stores.length > 0) {
      for (const store of data.stores) {
        store.userEdit = idUser;
        store.status = true;
      }
    }
    const result = await new model({ ...data });
    await result.save();
    return await result;
  }

  async findAllActive() {
    const result = await model.aggregate([
      {
        $unwind: '$stores', // Deshace el array 'stores' para tratar cada tienda por separado
      },
      {
        $group: {
          _id: '$_id', // Agrupa por el ID del producto
          totalStock: { $sum: '$stores.stock' }, // Suma el stock de todas las especificaciones
          name: { $first: '$name' }, // GREGA MAS CAMPOS A LA CONSULTA
          description: { $first: '$description' },
          price: { $first: '$priceCurrent' },
          priceOld: { $first: '$priceOld' },
          typeProduct: { $first: '$typeProduct' },
          image: { $first: '$image' },
          size: { $first: '$size' },
          exclusive: { $first: '$exclusive' },
          status: { $first: '$status' },
          category: { $first: '$category' },
          sku: { $first: '$sku' },
        },
      },
      {
        $match: {
          totalStock: { $ne: 0 }, // Excluye productos con suma de stock igual a 0
          status: { $ne: false },
        },
      },
    ]);
    return await result;
  }

  async findActive(idProd) {
    const result = await model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(idProd) }, // Busca por el ID del producto
      },
      {
        $unwind: '$stores',
      },
      {
        $match: {
          totalStock: { $ne: 0 }, // Excluye productos con suma de stock igual a 0
          status: { $ne: false },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'stores.userEdit',
          foreignField: '_id',
          as: 'userEditStore',
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'stores.store',
          foreignField: '_id',
          as: 'storeInfo',
        },
      },
      {
        $group: {
          _id: '$_id',
          totalStock: { $sum: '$stores.stock' },
          name: { $first: '$name' },
          typeProduct: { $first: '$typeProduct' },
          description: { $first: '$description' },
          image: { $first: '$image' },
          category: { $first: '$category' },
          size: { $first: '$size' },
          priceOld: { $first: '$priceOld' },
          priceCurrent: { $first: '$priceCurrent' },
          exclusive: { $first: '$exclusive' },
          sku: { $first: '$sku' },
          userEdit: { $first: '$userEdit' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          status: { $first: '$status' },
          userEditData: { $first: '$userEdit' },
          stores: { $addToSet: '$stores._id' },
          storesData: {
            $addToSet: {
              _id: '$stores.store',
              name: { $arrayElemAt: ['$storeInfo.name', 0] },
              location: { $arrayElemAt: ['$storeInfo.location', 0] },
              latitud: { $arrayElemAt: ['$storeInfo.latitud', 0] },
              longitud: { $arrayElemAt: ['$storeInfo.longitud', 0] },
              stock: '$stores.stock',
              createAt: '$stores.createAt',
              status: '$stores.status',
              userEditStore: {
                _id: { $arrayElemAt: ['$userEditStore._id', 0] },
                nickname: { $arrayElemAt: ['$userEditStore.nickname', 0] },
                email: { $arrayElemAt: ['$userEditStore.email', 0] },
                phone: { $arrayElemAt: ['$userEditStore.phone', 0] },
                name: { $arrayElemAt: ['$userEditStore.name', 0] },
                lastname: { $arrayElemAt: ['$userEditStore.lastname', 0] },
                motherlastname: {
                  $arrayElemAt: ['$userEditStore.motherlastname', 0],
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userEdit',
          foreignField: '_id',
          as: 'userEditData',
        },
      },
      {
        $project: {
          _id: 1,
          totalStock: 1,
          name: 1,
          typeProduct: 1,
          description: 1,
          image: 1,
          category: 1,
          size: 1,
          priceOld: 1,
          priceCurrent: 1,
          exclusive: 1,
          sku: 1,
          createdAt: 1,
          updatedAt: 1,
          status: 1,
          userEditData: {
            _id: 1,
            nickname: 1,
            email: 1,
            phone: 1,
            name: 1,
            lastname: 1,
            motherlastname: 1,
          },
          storesData: 1,
        },
      },
    ]);

    return result;
  }

  async findInStore(idProduct, nameStore) {
    // BUSCA UN PRODUCTO EN UNA TIENDA
    const result = await model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(idProduct),
        },
      },
      {
        $unwind: '$stores',
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'stores.store',
          foreignField: '_id',
          as: 'storeInfo',
        },
      },
      {
        $match: {
          'storeInfo.name': nameStore,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'stores.userEdit',
          foreignField: '_id',
          as: 'userEditStore',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userEdit',
          foreignField: '_id',
          as: 'userEditData',
        },
      },
      {
        $project: {
          _id: 1,
          stores: {
            stock: 1,
            status: 1,
            createdAt: 1,
          },
          userEditData: {
            name: { $arrayElemAt: ['$userEditData.name', 0] },
          },
          storeInfo: {
            _id: { $arrayElemAt: ['$storeInfo._id', 0] },
            name: { $arrayElemAt: ['$storeInfo.name', 0] },
            location: { $arrayElemAt: ['$storeInfo.location', 0] },
            latitud: { $arrayElemAt: ['$storeInfo.latitud', 0] },
            longitud: { $arrayElemAt: ['$storeInfo.longitud', 0] },
            userEditStore: {
              name: { $arrayElemAt: ['$userEditStore.name', 0] },
            },
          },
          // Agrega más campos según sea necesario
        },
      },
    ]);

    return result;
  }

  //OPCIONES DE ADMINISTRADOR
  async findId(idProd) {
    const result = await model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(idProd) }, // Busca por el ID del producto
      },
      {
        $unwind: {
          path: '$stores',
          preserveNullAndEmptyArrays: true // Preserva los documentos con 'stores' vacío o nulo
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'stores.store',
          foreignField: '_id',
          as: 'storeInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userEdit',
          foreignField: '_id',
          as: 'userEditData',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'stores.userEdit',
          foreignField: '_id',
          as: 'userEditStore',
        },
      },
      {
        $group: {
          _id: '$_id', // Agrupa por el ID del producto
          name: { $first: '$name' }, // GREGA MAS CAMPOS A LA CONSULTA
          sku: { $first: '$sku' },
          description: { $first: '$description' },
          typeProduct: { $first: '$typeProduct' },
          size: { $first: '$size' },
          exclusive: { $first: '$exclusive' },
          priceCurrent: { $first: '$priceCurrent' },
          priceOld: { $first: '$priceOld' },
          image: { $first: '$image' },
          status: { $first: '$status' },
          category: { $first: '$category' },
          updatedAt: { $first: '$updatedAt' },
          userEdit: {
            $addToSet: {
              _id: { $arrayElemAt: ['$userEditData._id', 0] },
              phone: { $arrayElemAt: ['$userEditData.phone', 0] },
              name: { $arrayElemAt: ['$userEditData.name', 0] },
              lastname: { $arrayElemAt: ['$userEditData.lastname', 0] },
            }
          },
          stores: {
            $addToSet: {
              _id: { $arrayElemAt: ['$storeInfo._id', 0] },
              name: { $arrayElemAt: ['$storeInfo.name', 0] },
              stock: '$stores.stock',
              status: '$stores.status',
              userEditStore: {
                _id: { $arrayElemAt: ['$userEditStore._id', 0] },
                phone: { $arrayElemAt: ['$userEditStore.phone', 0] },
                name: { $arrayElemAt: ['$userEditStore.name', 0] },
                lastname: { $arrayElemAt: ['$userEditStore.lastname', 0] },
              },
            },
          },
        },
      }
    ]);
    return await result;
  }

  async findProdStores(idStore) {
    let condition = {};
    if (idStore === "all") {
      condition = {};
    } else {
      condition = { 'stores.store': new mongoose.Types.ObjectId(idStore) };
    }
    const result = await model.aggregate([
      {
        $unwind: {
          path: '$stores',
          preserveNullAndEmptyArrays: true // Preserva los documentos con 'stores' vacío o nulo
        },
      },
      {
        $match: condition,
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'stores.store',
          foreignField: '_id',
          as: 'storeInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'stores.userEdit',
          foreignField: '_id',
          as: 'userEditStore',
        },
      },
      {
        $group: {
          _id: '$_id', // Agrupa por el ID del producto
          name: { $first: '$name' }, // GREGA MAS CAMPOS A LA CONSULTA
          sku: { $first: '$sku' },
          description: { $first: '$description' },
          typeProduct: { $first: '$typeProduct' },
          size: { $first: '$size' },
          exclusive: { $first: '$exclusive' },
          priceCurrent: { $first: '$priceCurrent' },
          priceOld: { $first: '$priceOld' },
          image: { $first: '$image' },
          status: { $first: '$status' },
          updatedAt: { $first: '$updatedAt' },
          stores: {
            $addToSet: {
              _id: { $arrayElemAt: ['$storeInfo._id', 0] },
              name: { $arrayElemAt: ['$storeInfo.name', 0] },
              stock: '$stores.stock',
              status: '$stores.status',
              userEditStore: {
                _id: { $arrayElemAt: ['$userEditStore._id', 0] },
                phone: { $arrayElemAt: ['$userEditStore.phone', 0] },
                name: { $arrayElemAt: ['$userEditStore.name', 0] },
                lastname: { $arrayElemAt: ['$userEditStore.lastname', 0] },
              },
            },
          },
        },
      }
    ]);

    return await result;
  }

  async del(idProd) {
    const result = await model.deleteOne({ _id: idProd }); // ELIMINA EL PRODUCTO
    return await result;
  }

  async updateStock(data, idUser) {
    const session = await model.startSession();
    await session.startTransaction();
    try {
      const stores = data.stores;
      for (const item of stores) {
        await model.updateOne(
          { "_id": data.idProduct, 'stores.store': item.store },
          {
            $set: {
              'stores.$.stock': item.stock,
              'stores.$.userEdit': idUser,
              'stores.$.updatedAt': new Date(),
            }
          },
        );
      }
      await session.commitTransaction();
      session.endSession();
      return true;
    }
    catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw boom.badRequest(error);
    }
  }

  async updateProduct(data, idUser) {
    const session = await model.startSession();
    await session.startTransaction();
    try {
      const result = await model.updateOne(
        { _id: data.idProduct },
        {
          $set: {
            name: data.name,
            sku: data.sku,
            description: data.description,
            image: data.image,
            priceCurrent: data.priceCurrent,
            priceOld: data.priceOld,
            typeProduct: data.typeProduct,
            category: data.category,
            status: data.status,
            exclusive: data.exclusive,
            size: data.size,
            userEdit: idUser,
            updatedAt: new Date(),
          },
        },
      );
      const stores = data.stores;
      for (const item of stores) {
        const updated = await model.updateOne(
          { "_id": data.idProduct, 'stores.store': item.store },
          {
            $set: {
              'stores.$.stock': item.stock,
              'stores.$.userEdit': idUser,
              'stores.$.status': item.status,
              'stores.$.updatedAt': new Date(),
            }
          },
        );

        if (updated.modifiedCount === 0) {
          await model.updateOne(
            { "_id": data.idProduct },
            {
              $addToSet: {
                'stores': {
                  'store': item.store,
                  'stock': item.stock,
                  'userEdit': idUser,
                  'status': item.status,
                  'updatedAt': new Date(),
                }
              }
            },
          );
        }
      }
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

module.exports = ProductService;
