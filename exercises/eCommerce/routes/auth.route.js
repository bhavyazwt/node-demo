const express = require("express");

//Router
const authRouter = express.Router();

//Controllers
const authController = require("../controllers/auth.controller");

//Validators and Schema's
const { validate } = require("../validator/validator");
const userSignupSchema = require("../schemas/userSignUpSchema");
const userLoginSchema = require("../schemas/userLoginSchema");

//POST Routes
authRouter.post("/register", validate(userSignupSchema), authController.signUp);
authRouter.post("/login", validate(userLoginSchema), authController.login);

module.exports = authRouter;
