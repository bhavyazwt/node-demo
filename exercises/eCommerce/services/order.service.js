const { Order, OrderItem, Cart, Product } = require("../models");

async function createOrder(user_id) {
  const cartItems = await Cart.findAll({
    include: [{ model: Product }],
    where: { user_id },
  });
  let total_price = 0;
  const orderItems = cartItems.map((item) => {
    total_price += item.quantity * item.Product.price;
    return {
      product_id: item?.product_id,
      quantity: item?.quantity,
      price: item.quantity * item.Product.price,
    };
  });

  const orderDetails = await Order.create({
    user_id,
    total_price,
    status: "pending",
  });
  const order_id = orderDetails.id;

  orderItems.forEach((item) => {
    addOrderItemsToDB(order_id, item);
  });
  return { order_id, orderItems };
}

async function addOrderItemsToDB(order_id, orderItem) {
  try {
    await OrderItem.create({ order_id, ...orderItem });
  } catch (err) {
    throw err;
  }
}

async function getOrdersFromDB(user_id, order_id = null) {
  const filters = {
    ...(user_id && { user_id }),
    ...(order_id && { id: order_id }),
  };
  return await Order.findAll({ where: filters });
}

async function updateOrderInDB(order_id, status) {
  return Order.update({ status }, { where: { id: order_id } });
}

module.exports = { createOrder, getOrdersFromDB, updateOrderInDB };
