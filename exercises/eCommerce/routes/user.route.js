const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");
const { validate } = require("../validator/validator");
const updateUserSchema = require("../schemas/updateUserSchema1");

userRouter.get(
  "/profile",
  authenticate(["admin", "customer"]),
  userController.getProfile
);
userRouter.put(
  "/profile",
  authenticate(["admin", "customer"]),
  validate(updateUserSchema),
  userController.updateProfile
);

userRouter.get("/", authenticate(["admin"]), userController.getAllUsers);

module.exports = userRouter;
