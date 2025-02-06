const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller");
const authenticate = require("../middlewares/authenticate");
const { fileUpload } = require("../utility/imageUpload");
const { validate } = require("../validator/validator");
const addProductSchema = require("../schemas/addProductSchema");
const updateProductSchema = require("../schemas/updateProductSchema");
const getProductSchema = require("../schemas/getProductSchema");

//POST Routes

// Add New Product
productRouter.post(
  "/",
  authenticate(["admin"]),
  fileUpload,
  validate(addProductSchema),
  productController.addNewProduct
);

//GET Routes

//Get Products
productRouter.get(
  "/",
  validate(getProductSchema),
  productController.getProducts
);

//Get Product Details
productRouter.get("/:id", productController.getProductsById);

//PATCH Routes

//Update A Product
productRouter.patch(
  "/:id",
  authenticate(["admin"]),
  fileUpload,
  validate(updateProductSchema),
  productController.updateProducts
);

//Delete Routes

//Delete A Product
productRouter.delete("/:id", productController.deleteProduct);

module.exports = productRouter;
