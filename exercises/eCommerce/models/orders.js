"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, OrderItem }) {
      this.belongsTo(User);
      this.hasMany(OrderItem);
    }
  }
  Order.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "shipped", "delivered", "canceled"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    }
  );
  return Order;
};
