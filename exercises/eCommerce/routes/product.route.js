const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller");
const authenticate = require("../middlewares/authenticate");
const { fileUpload } = require("../utility/imageUpload");
const { validate } = require("../validator/validator");
const addProductSchema = require("../schemas/addProductSchema");
const updateProductSchema = require("../schemas/updateProductSchema");

productRouter.post(
  "/",
  authenticate(["admin"]),
  fileUpload,
  validate(addProductSchema),
  productController.addNewProduct
);

productRouter.get("/", productController.getProducts);

productRouter.patch(
  "/:id",
  authenticate(["admin"]),
  fileUpload,
  validate(updateProductSchema),
  productController.updateProducts
);

productRouter.delete("/:id", productController.deleteProduct);

module.exports = productRouter;
