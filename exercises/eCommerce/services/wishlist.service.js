const { Wishlist, Product } = require("../models");

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
