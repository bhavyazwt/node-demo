const { Wishlist, Product } = require("../models");

/**
 * @description Add's Product To Wishlist.
 * @param {number} user_id - user's id [Decoded From JWT]
 * @param {string} product_id - product's id [Foreign Key]
 **/
async function addProductToWishlistDB(user_id, product_id) {
  const wishlist = await getProductInWishlistDB(user_id);
  const wishlistIds = wishlist.map((wishlist) => {
    return wishlist.product_id;
  });
  if (wishlistIds.includes(product_id)) {
    throw new Error("Product is already in wishlist");
  }
  return Wishlist.create({ user_id, product_id });
}

/**
 * @description Get's Product In Wishlist.
 * @param {number} user_id - user's id [Decoded From JWT]
 **/
async function getProductInWishlistDB(user_id) {
  try {
    return Wishlist.findAll({
      include: [{ model: Product }],
      where: { user_id },
    });
  } catch (err) {
    throw new Error(`Something Went Wrong ${err.message}`);
  }
}

/**
 * @description Delete Product From Wishlist.
 * @param {number} user_id - user's id [Decoded From JWT]
 * @param {string} product_id - product's id to delete from wishlist [Foreign Key]
 **/
async function deleteProductFromWishlistDB(product_id, user_id) {
  try {
    return Wishlist.destroy({ where: { product_id, user_id } });
  } catch (err) {
    throw new Error(`Something Went Wrong ${err.message}`);
  }
}
module.exports = {
  addProductToWishlistDB,
  getProductInWishlistDB,
  deleteProductFromWishlistDB,
};
