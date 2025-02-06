const { Product } = require("../models");
const fs = require("fs");

/**
 * @description - Add New Product In DB
 * @param {string} name - Product Name [Mandatory]
 * @param {string} description - Description Of Product [Optional]
 * @param {number} Price - Price Of Product [Mandatory]
 * @param {number} stock - Stock Of Product [Mandatory]
 * @param {string} category_id - Category Of Product [ Foreign Key ]
 * @param {string} image_url - URL of uploaded image
 **/
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

/**
 * @description - Fetch Product From DB
 * @param {number} ID -  Optional, If not passed gives all orders.
 * @param {object} sortingAndPagination - Sorting And Pagination
 **/
async function getProductsFromDB(id, sortingAndPagination = {}) {
  try {
    return Product.findAll({
      ...(id && { where: { id } }),
      ...sortingAndPagination,
    });
  } catch (err) {
    throw new Error(`Error getting products: ${err.message}`);
  }
}

/**
 * @description - Fetch Product In DB
 * @param {number} ID -  [Mandatory]
 * @param {object} updatedProduct - Updated Product Object
 **/
async function updateProduct(id, updatedProduct) {
  try {
    return Product.update(updatedProduct, { where: { id } });
  } catch (err) {
    throw new Error(`Error Updating Product! ${err.message}`);
  }
}

/**
 * @description - Deletes Product From DB
 * @param {number} ID -  [Mandatory]
 **/
async function deleteProductFromDB(id) {
  try {
    return Product.destroy({ where: { id } });
  } catch (err) {
    throw new Error(`Error Deleting Product!, ${err.message}`);
  }
}

/**
 * @description - Deletes Image From Local Directory
 * @param {string} path - Path To Image
 **/
async function deleteImageFromStorage(path) {
  fs.unlink(path, (err) => {
    if (err && err.code == "ENOENT") {
      throw new Error("File already deleted.");
    } else if (err) {
      throw new Error("Something Went Wrong Updating the Product");
    }
  });
}

/**
 * @description - Reduce Quantity After Order is Placed
 * @param {string} product_id - Product's id whose quantity to reduce
 * @param {string} quantity - Quantity to reduce from product
 **/
async function reduceQuantityFromDB(product_id, quantity) {
  const product = await Product.findOne({ where: { id: product_id } });

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
