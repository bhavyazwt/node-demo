const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller");
const authenticate = require("../middlewares/authenticate");
const { fileUpload } = require("../utility/imageUpload");

productRouter.post(
  "/",
  authenticate(["admin"]),
  fileUpload,
  productController.addNewProduct
);

module.exports = productRouter;
