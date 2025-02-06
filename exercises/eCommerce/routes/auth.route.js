const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const { validate } = require("../validator/validator");
const userSignupSchema = require("../schemas/userSignUpSchema");
const userLoginSchema = require("../schemas/userLoginSchema");

authRouter.post("/register", validate(userSignupSchema), authController.signUp);
authRouter.post("/login", validate(userLoginSchema), authController.login);

module.exports = authRouter;
