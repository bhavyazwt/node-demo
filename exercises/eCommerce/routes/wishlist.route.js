const express = require("express");

//Router
const wishlistRouter = express.Router();

//Controller
const wishlistController = require("../controllers/wishlist.controller");

//Middleware
const authenticate = require("../middlewares/authenticate");

//Add Product To Wishlist
wishlistRouter.post(
  "/",
  authenticate(["customer", "admin"]),
  wishlistController.addProductToWishlist
);

//Get Products from Wishlist
wishlistRouter.get(
  "/",
  authenticate(["customer", "admin"]),
  wishlistController.getProductsInWishlist
);

//Delete Product from Wishlist
wishlistRouter.delete(
  "/:id",
  authenticate(["customer", "admin"]),
  wishlistController.deleteProductFromWishlist
);

module.exports = wishlistRouter;
