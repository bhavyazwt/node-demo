const { Product } = require("../models");
const fs = require("fs");
async function addProduct(
  name,
  description,
  price,
  stock,
  category_id,
  image_url = null
) {
  try {
    return Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      image_url,
    });
  } catch (err) {
    throw new Error(`Error adding product: ${err.message}`);
  }
}

async function getProductsFromDB(
  id = null,
  page = 1,
  limit = 10,
  sort = "id",
  sortType = "ASC"
) {
  try {
    if (!id)
      return Product.findAll({
        limit,
        offset: limit * (page - 1),
        order: [[sort, sortType]],
      });
    return Product.findOne({ where: { id } });
  } catch (err) {
    throw new Error(`Error getting products: ${err.message}`);
  }
}

async function updateProduct(id, updateBody) {
  try {
    return Product.update(updateBody, { where: { id } });
  } catch (err) {
    throw new Error(`Error Updating Product! ${err.message}`);
  }
}

async function deleteProductFromDB(id) {
  try {
    return Product.destroy({ where: { id } });
  } catch (err) {
    throw new Error(`Error Deleting Product!, ${err.message}`);
  }
}

async function deleteImageFromStorage(path) {
  fs.unlink(path, (err) => {
    if (err && err.code == "ENOENT") {
      throw new Error("File already deleted.");
    } else if (err) {
      throw new Error("Something Went Wrong Updating the Product");
    }
  });
}

async function reduceQuantityFromDB(product_id, quantity) {
  const product = await Product.findOne({ where: { id: product_id } });
  console.log(product);
  if (product.stock - quantity === 0) {
    return await Product.destroy({ id: product_id });
  }
  product.stock -= quantity;
  await product.save();
}

module.exports = {
  addProduct,
  getProductsFromDB,
  updateProduct,
  deleteProductFromDB,
  deleteImageFromStorage,
  reduceQuantityFromDB,
};
