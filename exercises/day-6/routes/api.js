const express = require("express");
const path = require("path");

//For File Uploads
const { fileUpload } = require("../utility/imageUpload");

//Router
const router = express.Router();

//Controllers
const userController = require("../controllers/userController");
//Validators
const idValidator = require("../middlewares/idValidator");
const { validate } = require("../validator/validator");

//middlewares
const authenticate = require("../middlewares/authenticate");

//schema
const createUserSchema = require("../schemas/createUserSchema");
const updateUserSchema = require("../schemas/updateUserSchema");
const userProfileSchema = require("../schemas/userProfileSchema");
const getUserSchema = require("../schemas/getUserSchema");
const pdfUpload = require("../utility/pdfUpload");

// User GET ROUTES
router.get("/", userController.home);
router.get(
  "/users",
  validate(getUserSchema),
  authenticate,
  userController.getUsers
);
router.get(
  "/users/:id",
  authenticate,
  idValidator,
  userController.getUsersById
);
router.get(
  "/user-profile/:id",
  authenticate,
  userController.getUserProfilesById
);

// User POST Routes
router.post(
  "/users",
  validate(createUserSchema),
  authenticate,
  userController.createUser
);
router.post(
  "/:id/upload-image",
  authenticate,
  idValidator,
  fileUpload,
  userController.fileController
);
router.post(
  "/:id/user-profile",
  idValidator,
  authenticate,
  validate(userProfileSchema),
  userController.createProfile
);

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/reauth", userController.refreshAuthToken);
// User PATCH Routes
router.patch(
  "/users/:id",
  authenticate,
  idValidator,
  validate(updateUserSchema),
  userController.updateUser
);

// User DELETE Routes
router.delete(
  "/users/:id",
  authenticate,
  idValidator,
  userController.deleteUser
);
router.delete(
  "/user-profile/:id",
  authenticate,
  userController.deleteUserProfile
);
router.delete(
  "/user-images/:userId",
  authenticate,
  idValidator,
  userController.deleteUserImage
);

//User Profile PUT Routes
router.put(
  "/user-profile/:id",
  authenticate,
  idValidator,
  validate(userProfileSchema),
  userController.updateUserProfile
);

//User data using FORM Data
// router.post("/user-data", pdfUpload, userController.createUserData);

module.exports = router;
