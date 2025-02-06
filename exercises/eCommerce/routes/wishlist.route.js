const express = require("express");
const wishlistRouter = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const authenticate = require("../middlewares/authenticate");

wishlistRouter.post(
  "/",
  authenticate(["customer", "admin"]),
  wishlistController.addProductToWishlist
);

wishlistRouter.get(
  "/",
  authenticate(["customer", "admin"]),
  wishlistController.getProductsInWishlist
);

wishlistRouter.delete(
  "/:id",
  authenticate(["customer", "admin"]),
  wishlistController.deleteProductFromWishlist
);

module.exports = wishlistRouter;
