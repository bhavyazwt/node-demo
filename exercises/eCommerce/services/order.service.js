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

  const orderItemsWithOrderID = orderItems.map((item) => {
    return { order_id, ...item };
  });

  await OrderItem.bulkCreate(orderItemsWithOrderID);

  return OrderItem.findAll({
    where: { order_id },
    attributes: ["id", "order_id", "product_id", "quantity", "price"],
    include: [
      {
        model: Product,
        attributes: ["name", "description", "image_url"],
      },
      {
        model: Order,
        attributes: ["total_price"],
      },
    ],
  });
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
 *
 **/
const getOrdersFromDB = async (user_id, order_id = null) => {
  const filters = {
    ...(user_id && { user_id }),
    ...(order_id && { id: order_id }),
  };

  return await Order.findAll({
    where: filters,
    attributes: ["id", "total_price", "status", "createdAt"],
    include: [
      {
        model: OrderItem,
        attributes: ["quantity", "price"],
        include: [
          {
            model: Product,
            attributes: ["name", "image_url"],
          },
        ],
      },
    ],
  });
};
/**
 * @description Update Order in DB
 * @param {number} order_id - order's id
 * @param {string} status - status of order: ['pending' , 'shipped' , 'delivered' , 'canceled']
 **/
async function updateOrderInDB(order_id, status) {
  return Order.update({ status }, { where: { id: order_id } });
}

const getAllOrdersFromDB = async (sortingAndPagination) => {
  return await Order.findAndCountAll({
    attributes: ["id", "total_price", "status", "createdAt"],
    include: [
      {
        model: OrderItem,
        attributes: ["quantity", "price"],
        include: [
          {
            model: Product,
            attributes: ["name", "image_url"],
          },
        ],
      },
    ],
    distinct: true,
    ...sortingAndPagination,
  });
};

module.exports = {
  createOrder,
  getOrdersFromDB,
  updateOrderInDB,
  getAllOrdersFromDB,
};
