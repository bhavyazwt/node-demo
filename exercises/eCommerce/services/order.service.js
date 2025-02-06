const { Order, OrderItem, Cart, Product } = require("../models");

/**
 * @description Add's Order Item to DB.
 * @param {number} user_id - user's id [ Decoded from JWT ]
 **/
async function createOrder(user_id) {
  //Find Cart Items from user's cart
  const cartItems = await Cart.findAll({
    include: [{ model: Product }],
    where: { user_id },
  });

  let total_price = 0;

  // Creating Array of Objects of CartItems for OrderItems while calculating total price.
  const orderItems = cartItems.map((item) => {
    total_price += item.quantity * item.Product.price;
    return {
      product_id: item?.product_id,
      quantity: item?.quantity,
      price: item.quantity * item.Product.price,
    };
  });

  // Creating Order with total price.
  const orderDetails = await Order.create({
    user_id,
    total_price,
    status: "pending",
  });
  const order_id = orderDetails.id;

  // Adding Order Items for the OrderID generated above.
  orderItems.forEach((item) => {
    addOrderItemsToDB(order_id, item);
  });
  return { order_id, orderItems };
}

/**
 * @description Add's Order Item to DB.
 * @param {number} order_id - order's id
 * @param {object} orderItem  - Object with 3 properties product_id quantity and price.
 **/
async function addOrderItemsToDB(order_id, orderItem) {
  try {
    await OrderItem.create({ order_id, ...orderItem });
  } catch (err) {
    throw err;
  }
}

/**
 * @description Get Order of User from DB.
 * @param {number} user_id - user's id [ Decoded from JWT ]
 * @param {object} order_id  - order's id
 **/
async function getOrdersFromDB(user_id, order_id = null) {
  const filters = {
    ...(user_id && { user_id }),
    ...(order_id && { id: order_id }),
  };
  return await Order.findAll({ where: filters });
}

/**
 * @description Update Order in DB
 * @param {number} order_id - order's id
 * @param {string} status - status of order: ['pending' , 'shipped' , 'delivered' , 'canceled']
 **/
async function updateOrderInDB(order_id, status) {
  return Order.update({ status }, { where: { id: order_id } });
}

module.exports = { createOrder, getOrdersFromDB, updateOrderInDB };
