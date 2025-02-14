const {
  addProductToCartDB,
  getProductInCartDB,
  deleteProductFromCartDB,
  changeQuantityProduct,
} = require("../services/cart.service");
const { getProductsFromDB } = require("../services/product.service");

// Add's Product To Cart
async function addProductToCart(req, res) {
  try {
    const { productId, quantity } = req?.body;

    // Validating If Product Exists Or Not.
    const product = await getProductsFromDB(productId);
    if (!product.length) {
      return res
        .status(500)
        .json({ error: "Product Doesn't exists! Add a valid Product" });
    }

    //Adding to Cart if Product exists.
    const cart = await addProductToCartDB(req.userId, productId, quantity);

    if (cart) {
      return res
        .status(200)
        .json({ message: "Successfully Added Product To Cart!" });
    } else {
      throw new Error("Error Adding Product");
    }
  } catch (err) {
    return res.status(500).json({
      error: `Something Went Wrong, ${err.message}`,
    });
  }
}

// Get Product In Cart
async function getProductsInCart(req, res) {
  try {
    const user_id = req.userId;
    let products = await getProductInCartDB(user_id);
    if (products) {
      const total_price = products.reduce((sum, item) => {
        return sum + item.quantity * parseFloat(item.Product.price);
      }, 0);
      products = { total_price, products };
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
    const cartId = req.params.id;

    const isDeleted = await deleteProductFromCartDB(cartId);
    if (isDeleted) {
      return res
        .status(200)
        .json({ message: "Product Deleted Successfully from Cart!" });
    } else {
      throw new Error("Product Doesn't exists in cart!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: `Something Went Wrong, ${err.message}`,
    });
  }
}

async function changeProductQty(req, res) {
  try {
    const cartId = req.body.id;
    const type = req.body.type;
    const isChanged = await changeQuantityProduct(cartId, type);
    if (isChanged) {
      return res.status(200).json({ message: "Product Quantity Updated!" });
    } else {
      throw new Error("Error Changing Product Quantity");
    }
  } catch (err) {
    res.status(500).json({
      error: `Something Went Wrong, ${err.message}`,
    });
  }
}

module.exports = {
  addProductToCart,
  getProductsInCart,
  deleteProductFromCart,
  changeProductQty,
};
