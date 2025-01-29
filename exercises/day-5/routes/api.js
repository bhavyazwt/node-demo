const express = require("express");
const path = require("path");

//For File Uploads
const fileUpload = require("../utility/imageUpload");

//Router
const router = express.Router();

//Controllers
// const userController = require("../controllers/userController");
const userController = require("../controllers/userController");
//Validators
const idValidator = require("../middlewares/idValidator");
const { validate } = require("../validator/validator");

//schema
const createUserSchema = require("../schemas/createUserSchema");
const updateUserSchema = require("../schemas/updateUserSchema");
const userProfileSchema = require("../schemas/userProfileSchema");
const getUserSchema = require("../schemas/getUserSchema");
const pdfUpload = require("../utility/pdfUpload");

// User GET ROUTES
router.get("/", userController.home);
router.get("/users", validate(getUserSchema), userController.getUsers);
router.get("/users/:id", idValidator, userController.getUsersById);
router.get(
  "/user-profile/:id",
  idValidator,
  userController.getUserProfilesById
);

// User POST Routes
router.post("/users", validate(createUserSchema), userController.createUser);
router.post("/:id/upload-image", fileUpload, userController.fileController);
router.post(
  "/:id/user-profile",
  validate(userProfileSchema),
  idValidator,
  userController.createProfile
);

// User PATCH Routes
router.patch(
  "/users/:id",
  validate(updateUserSchema),
  idValidator,
  userController.updateUser
);

// User DELETE Routes
router.delete("/users/:id", idValidator, userController.deleteUser);
router.delete(
  "/user-images/:userId",
  idValidator,
  userController.deleteUserImage
);

//User Profile PUT Routes
router.put(
  "/user-profile/:id",
  validate(userProfileSchema),
  idValidator,
  userController.updateUserProfile
);

//User data using FORM Data
router.post("/user-data", pdfUpload, userController.createUserData);

module.exports = router;
