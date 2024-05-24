const ProductFood = require('../schemas/product.food.schema');

class ProductService {
  async findByStore(storeId) {
    const products = await ProductFood.find({
      store: storeId,
    }).exec();

    return products;
  }

  async findOne(id) {
    const product = await ProductFood.findOne({ _id: id })
      .populate('store')
      .exec();

    return product;
  }

  async create(product) {
    const newProduct = new ProductFood(product);
    const result = await newProduct.save();

    return result;
  }

  async update(id, product) {
    const res = ProductFood.findOneAndUpdate({ _id: id }, product).exec();
    return res;
  }

  async delete(id) {
    const product = ProductFood.findOneAndDelete({ _id: id }).exec();
    return product;
  }
}

module.exports = ProductService;
