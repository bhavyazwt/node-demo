const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cart.controller");
const authenticate = require("../middlewares/authenticate");

cartRouter.post(
  "/",
  authenticate(["customer", "admin"]),
  cartController.addProductToCart
);

cartRouter.get(
  "/",
  authenticate(["customer", "admin"]),
  cartController.getProductsInCart
);

cartRouter.delete(
  "/:id",
  authenticate(["customer", "admin"]),
  cartController.deleteProductFromCart
);

module.exports = cartRouter;
