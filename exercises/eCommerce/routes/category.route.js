const express = require("express");
const categoryRouter = express.Router();
const authenticate = require("../middlewares/authenticate");
const categoryController = require("../controllers/category.controller");
const { validate } = require("../validator/validator");
const addCategorySchema = require("../schemas/addCategorySchema");

categoryRouter.post(
  "/",
  authenticate(["admin"]),
  validate(addCategorySchema),
  categoryController.createCategory
);
categoryRouter.get("/", categoryController.getAllCategories);

module.exports = categoryRouter;
