const {
  addProductToCartDB,
  getProductInCartDB,
  deleteProductFromCartDB,
  changeQuantityProduct,
  getAllCarts,
} = require("../services/cart.service");
const { getProductsFromDB } = require("../services/product.service");
const cron = require("node-cron");
const { sendEmail } = require("../utility/nodeMailer");
require("dotenv").config();

// Add's Product To Cart
async function addProductToCart(req, res) {
  try {
    const { productId, quantity } = req?.body;

    // Validating If Product Exists Or Not.
    const product = await getProductsFromDB(productId);
    if (!product.rows.length) {
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

async function rejectPromiseDummy() {
  try {
    throw new Error();
  } catch (e) {
    return Promise.reject(e);
  }
}

function forgotItemsInCartMailCreator(email, userName, productName) {
  return {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: `Hi ${userName} You Forgot Something in Your cart!`,
    text: `You forgot ${productName} in your cart!`,
  };
}

function mailPromiseMaker(carts) {
  return carts.map(async (cart, index) => {
    if (index === 1) {
      await rejectPromiseDummy();
      return;
    } else {
      const email = cart["User"].email;
      const firstName = cart["User"].first_name;
      const productName = cart["Product"].name;
      const emailBody = forgotItemsInCartMailCreator(
        email,
        firstName,
        productName
      );
      await sendEmail(emailBody);
    }
  });
}

function retryPromises(carts, rejectedPromisesIndexes, tries) {
  //Check for max tries
  console.log(tries);
  console.log(rejectedPromisesIndexes);
  if (!rejectedPromisesIndexes.length || tries === 0) return;

  // If tries are left retry sending mail
  // Get All Promises Of Rejected Mails
  const promisesToRetry = rejectedPromisesIndexes.map(async (index) => {
    const userEmail = carts[index]["User"].email;
    const userFirstName = carts[index]["User"].first_name;
    const productName = carts[index]["Product"].name;
    const emailBody = forgotItemsInCartMailCreator(
      userEmail,
      userFirstName,
      productName
    );
    await sendEmail(emailBody);
  });

  // const retryPromises = retryPromisesMaker(carts, rejectedPromiseIndexes);
  Promise.allSettled(promisesToRetry).then((values) => {
    rejectedPromisesIndexes = [];

    // Check again which promises got rejected
    values.forEach((value, index) => {
      if (value.status === "rejected") rejectedPromisesIndexes.push(index);
    });

    //Retry Again
    retryPromises(carts, rejectedPromisesIndexes, --tries);
  });
}

async function checkCartAndSendMails(req, res) {
  try {
    let rejectedPromisesIndexes = [];

    //Get All Carts
    const carts = await getAllCarts();

    //Get Promises of All Mail To Send
    const mailPromises = mailPromiseMaker(carts);

    //Try to resolve all promises
    Promise.allSettled(mailPromises).then((values) => {
      // Find Rejected Promises
      values.forEach((value, index) => {
        if (value.status === "rejected") rejectedPromisesIndexes.push(index);
      });

      //Retry Rejected Promises
      retryPromises(carts, rejectedPromisesIndexes, 3);
    });

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
}

// cron.schedule("5 * * * *",);

module.exports = {
  addProductToCart,
  getProductsInCart,
  deleteProductFromCart,
  changeProductQty,
  // cronSchedulerForCart,
  checkCartAndSendMails,
};
