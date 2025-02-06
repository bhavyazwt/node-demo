const {
  addProductToWishlistDB,
  getProductInWishlistDB,
  deleteProductFromWishlistDB,
} = require("../services/wishlist.service");

// Add Product To Wishlist
async function addProductToWishlist(req, res) {
  try {
    const { productId } = req?.body;

    const wishlist = await addProductToWishlistDB(req.userId, productId);
    if (wishlist) {
      return res
        .status(200)
        .json({ message: "Successfully Added Product To Wishlist!" });
    } else {
      throw new Error("Error Adding Product");
    }
  } catch (err) {
    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res
        .status(500)
        .json({ error: "Product Doesn't exists! Add a valid Product" });
    }
    return res.status(500).json({
      error: `Something Went Wrong, ${err.message}`,
    });
  }
}

// Get Product In Wishlist From DB
async function getProductsInWishlist(req, res) {
  try {
    const user_id = req.userId;
    const products = await getProductInWishlistDB(user_id);
    if (products) {
      return res.status(200).json({
        message: products.length
          ? "Wishlist Found!"
          : "No Products in Wishlist!",
        data: products,
      });
    } else {
      throw new Error("Error Fetching Product");
    }
  } catch (err) {
    return res.status(500).json({
      error: `Something Went Wrong, ${err.message}`,
    });
  }
}

// Delete Product In Wishlist From DB
async function deleteProductFromWishlist(req, res) {
  try {
    const productId = req.params.id;
    const isDeleted = await deleteProductFromWishlistDB(productId, req.userId);
    if (isDeleted) {
      return res
        .status(200)
        .json({ message: "Product Deleted from Wishlist Successfully!" });
    } else {
      throw new Error("Product Not Found In Wishlist");
    }
  } catch (err) {
    return res.status(500).json({
      error: `Something Went Wrong, ${err.message}`,
    });
  }
}

module.exports = {
  addProductToWishlist,
  getProductsInWishlist,
  deleteProductFromWishlist,
};
