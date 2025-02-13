const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cart.controller");
const authenticate = require("../middlewares/authenticate");
const addProductToCartSchema = require("../schemas/addProductToCartSchema");
const { validate } = require("../validator/validator");

//Add Product to Cart [Only CUSTOMERS]
cartRouter.post(
  "/",
  authenticate(["customer"]),
  validate(addProductToCartSchema),
  cartController.addProductToCart
);

cartRouter.post(
  "/updateQuantity",
  authenticate(["customer"]),
  cartController.changeProductQty
);

//Get Cart Details [Only CUSTOMERS]
cartRouter.get(
  "/",
  authenticate(["customer"]),
  cartController.getProductsInCart
);

//Get Product from Cart  [Only CUSTOMERS]
cartRouter.delete(
  "/:id",
  authenticate(["customer"]),
  cartController.deleteProductFromCart
);

module.exports = cartRouter;
