const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const idValidator = require("../middlewares/idValidator");

router.get("/", userController.home);
router.get("/users", userController.getUsers);
router.get("/users/:id", idValidator, userController.getUsersById);
router.post("/users", userController.createUser);
router.patch("/users/:id", idValidator, userController.updateUser);
router.delete("/users/:id", idValidator, userController.deleteUser);

module.exports = router;
