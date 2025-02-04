const { Product } = require("../models");

async function addProduct(
  name,
  description,
  price,
  stock,
  category_id,
  image_url
) {
  try {
    return await Product.create({
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

module.exports = { addProduct };
