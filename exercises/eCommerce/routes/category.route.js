const express = require("express");
const categoryRouter = express.Router();
const authenticate = require("../middlewares/authenticate");
const categoryController = require("../controllers/category.controller");
const { validate } = require("../validator/validator");
const addCategorySchema = require("../schemas/addCategorySchema");
const getCategorySchema = require("../schemas/getCategorySchema");

//POST Routes

//Add New Category
categoryRouter.post(
  "/",
  authenticate(["admin"]),
  validate(addCategorySchema),
  categoryController.createCategory
);

//GET Routes

//Get All Categories
categoryRouter.get(
  "/",
  validate(getCategorySchema),
  categoryController.getAllCategories
);

module.exports = categoryRouter;
