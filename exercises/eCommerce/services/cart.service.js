const { Cart, Product } = require("../models");

/**
 * @description Add's Product To Cart While Checking the Available Stock.
 * @param {number} user_id - user's id [Decoded From JWT]
 * @param {string} product_id - product's id [Foreign Key]
 * @param {string} quantity  - quantity to add to cart [ Default 1]
 *
 **/
async function addProductToCartDB(user_id, product_id, quantity = 1) {
  const exisitingCart = await Cart.findOne({ where: { user_id, product_id } });

  //If Existing Product's Quantity Increases
  if (exisitingCart) {
    const currQty = exisitingCart.quantity;

    // Calculating Total Quantity In Cart
    let newQty = currQty + quantity;

    const product = await Product.findOne({ where: { id: product_id } });
    const availableQty = product.stock;

    // User can only add max quantity as per stock.
    if (availableQty >= newQty) {
      exisitingCart.quantity = newQty;
      return exisitingCart.save();
    } else {
      throw new Error(`Stock not available, Availble Stock: ${availableQty}`);
    }
  } else {
    //If No Product Exists in Cart, Create Cart with the Quantity Provided
    return Cart.create({ user_id, product_id, quantity });
  }
}

async function changeQuantityProduct(cart_id, type) {
  try {
    const cart = await Cart.findOne({ where: { id: cart_id } });
    if (type === "increase") {
      cart.quantity += 1;
    } else if (type === "decrease") {
      if (cart.quantity === 1) {
        return deleteProductFromCartDB(cart_id);
      }
      cart.quantity -= 1;
    }

    return cart.save();
  } catch (err) {
    throw new Error(`Something Went Wrong ${err.message}`);
  }
}

/**
 * @description Get's Product in Cart of a user using user_id.
 * @param {number} user_id - user's id [Decoded From JWT]
 **/
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

/**
 * @description Delete Product From Cart of user .
 * @param {number} user_id - user's id [Decoded From JWT]
 * @param {number} product_id -product id to delete from cart
 **/
async function deleteProductFromCartDB(id) {
  try {
    return Cart.destroy({ where: { id } });
  } catch (err) {
    console.log(err);
    throw new Error(`Something Went Wrong ${err.message}`);
  }
}

/**
 * @description Delete Whole Cart From DB.
 * @param {number} user_id - user's id [Decoded From JWT]
 **/
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
  changeQuantityProduct,
};
