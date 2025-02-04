const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");

authRouter.post("/register", authController.signUp);
authRouter.post("/login", authController.login);

module.exports = authRouter;
