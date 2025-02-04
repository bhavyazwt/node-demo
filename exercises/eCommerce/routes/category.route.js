const express = require("express");
const categoryRouter = express.Router();
const authenticate = require("../middlewares/authenticate");
const categoryController = require("../controllers/category.controller");

categoryRouter.post(
  "/",
  authenticate(["admin"]),
  categoryController.createCategory
);
categoryRouter.get("/", categoryController.getAllCategories);

module.exports = categoryRouter;
