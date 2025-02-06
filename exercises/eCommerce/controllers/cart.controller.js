const {
  addProductToCartDB,
  getProductInCartDB,
  deleteProductFromCartDB,
} = require("../services/cart.service");

// Add's Product To Cart
async function addProductToCart(req, res) {
  try {
    const { productId, quantity } = req?.body;
    const cart = await addProductToCartDB(req.userId, productId, quantity);
    if (cart) {
      return res
        .status(200)
        .json({ message: "Successfully Added Product To Cart!" });
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

// Get Product In Cart
async function getProductsInCart(req, res) {
  try {
    const user_id = req.userId;
    const products = await getProductInCartDB(user_id);
    if (products) {
      return res.status(200).json({
        message: products.length ? "Cart Found!" : "No Products in Cart!",
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

// Delete Product From Cart
async function deleteProductFromCart(req, res) {
  try {
    const user_id = req.userId;
    const productId = req.params.id;
    const isDeleted = await deleteProductFromCartDB(productId, user_id);
    if (isDeleted) {
      return res
        .status(200)
        .json({ message: "Product Deleted Successfully from Cart!" });
    } else {
      throw new Error("Product Doesn't exists in cart!");
    }
  } catch (err) {
    return res.status(500).json({
      error: `Something Went Wrong, ${err.message}`,
    });
  }
}

module.exports = { addProductToCart, getProductsInCart, deleteProductFromCart };
