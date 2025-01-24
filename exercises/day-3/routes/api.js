const express = require("express");
const path = require("path");
//For File Uploads
const fileUpload = require("../utility/imageUpload");
//Router
const router = express.Router();

//Controllers
const userController = require("../controllers/userController");
//Validators
const idValidator = require("../middlewares/idValidator");

// User GET ROUTES
router.get("/", userController.home);
router.get("/users", userController.getUsers);
router.get("/users/:id", idValidator, userController.getUsersById);

// User POST Routes
router.post("/users", userController.createUser);
router.post("/:id/upload-image", fileUpload, userController.fileController);

// User PATCH Routes
router.patch("/users/:id", idValidator, userController.updateUser);

// User DELETE Routes
router.delete("/users/:id", idValidator, userController.deleteUser);

module.exports = router;
