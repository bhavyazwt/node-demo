const { deleteCartFromDB } = require("../services/cart.service");
const {
  createOrder,
  getOrdersFromDB,
  updateOrderInDB,
} = require("../services/order.service");
const { reduceQuantityFromDB } = require("../services/product.service");

async function placeOrder(req, res) {
  try {
    const user_id = req.userId;
    const isOrderCreated = await createOrder(user_id);
    console.log(isOrderCreated);
    if (isOrderCreated) {
      await deleteCartFromDB(user_id);
      // isOrderCreated.orderItems.forEach(async (orderItem) => {
      //   await reduceQuantityFromDB(orderItem.product_id, orderItem.quantity);
      // });
      return res
        .status(200)
        .json({ message: "Order Placed Successful", data: isOrderCreated });
    } else {
      throw new Error("Error Placing Order!");
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Order Details Of User
async function getOrderDetails(req, res) {
  try {
    const user_id = req.userId;
    const order_id = req?.params?.id;
    const orders = await getOrdersFromDB(user_id, order_id);
    if (orders) {
      return res.status(200).json({
        message: orders.length ? "Order Details Found" : "No Orders Found",
        data: orders,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

//Update Order Details - [Only ADMINS]
async function updateOrderDetails(req, res) {
  try {
    const order_id = req?.params?.id;
    const { status } = req.body;
    const userId = req?.userId;
    const isOrderUpdated = await updateOrderInDB(order_id, status);
    if (isOrderUpdated) {
      const orderDetails = await getOrdersFromDB(userId, order_id);
      return res.status(200).json({
        message: "Order Details Updated Successfully!",
        data: orderDetails,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: `Something Went Wrong ${err.message}` });
  }
}

module.exports = { placeOrder, getOrderDetails, updateOrderDetails };
