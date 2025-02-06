const express = require("express");
const orderRouter = express.Router();
const authenticate = require("../middlewares/authenticate");
const orderController = require("../controllers/order.controller");
const { validate } = require("../validator/validator");

orderRouter.post(
  "/",
  authenticate(["admin", "customer"]),
  orderController.placeOrder
);
orderRouter.get(
  "/",
  authenticate(["admin", "customer"]),
  orderController.getOrderDetails
);

orderRouter.get(
  "/:id",
  authenticate(["admin", "customer"]),
  orderController.getOrderDetails
);

orderRouter.put(
  "/:id/status",
  authenticate(["admin", "customer"]),
  orderController.updateOrderDetails
);

module.exports = orderRouter;
