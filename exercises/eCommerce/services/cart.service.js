const { Cart, Product } = require("../models");

async function addProductToCartDB(user_id, product_id, quantity = 1) {
  const exisitingCart = await Cart.findOne({ where: { user_id, product_id } });
  console.log("existing cart", exisitingCart);
  if (exisitingCart) {
    const currQty = exisitingCart.quantity;
    let newQty = currQty + quantity;
    const product = await Product.findOne({ where: { id: product_id } });
    const availableQty = product.stock;
    if (availableQty >= newQty) {
      exisitingCart.quantity = newQty;
      return exisitingCart.save();
    } else {
      throw new Error(`Stock not available, Availble Stock: ${availableQty}`);
    }
  } else {
    return Cart.create({ user_id, product_id, quantity });
  }
}

async function getProductInCartDB(user_id) {
  try {
    return Cart.findAll({
      include: [{ model: Product }],
      where: { user_id },
    });
  } catch (err) {
    throw new Error(`Something Went Wrong ${err.message}`);
  }
}

async function deleteProductFromCartDB(id) {
  try {
    return Cart.destroy({ where: { product_id: id } });
  } catch (err) {
    throw new Error(`Something Went Wrong ${err.message}`);
  }
}

async function deleteCartFromDB(user_id) {
  try {
    return Cart.destroy({ where: { user_id } });
  } catch (err) {
    throw new Error(`Something Went Wrong ${err.message}`);
  }
}

module.exports = {
  addProductToCartDB,
  getProductInCartDB,
  deleteProductFromCartDB,
  deleteCartFromDB,
};
