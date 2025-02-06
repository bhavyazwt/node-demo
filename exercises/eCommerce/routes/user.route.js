const express = require("express");

//Router
const userRouter = express.Router();

//Controller
const userController = require("../controllers/user.controller");

//Middleware
const authenticate = require("../middlewares/authenticate");

//Validator and Schema's
const { validate } = require("../validator/validator");
const updateUserSchema = require("../schemas/updateUserSchema1");
const getAllUsersSchema = require("../schemas/getAllUsersSchema");

//GET Routes

//GET Profile of User
userRouter.get(
  "/profile",
  authenticate(["admin", "customer"]),
  userController.getProfile
);

// Get All User Profile - (ONLY ADMINS)
userRouter.get(
  "/",
  authenticate(["admin"]),
  validate(getAllUsersSchema),
  userController.getAllUsers
);

//PUT Routes

//Update Own Profile
userRouter.put(
  "/profile",
  authenticate(["admin", "customer"]),
  validate(updateUserSchema),
  userController.updateProfile
);

module.exports = userRouter;
