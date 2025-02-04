"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order, Product }) {
      this.belongsTo(Order, { foreignKey: "order_id", onDelete: "cascade" });
      this.belongsTo(Product, {
        foreignKey: "product_id",
        onDelete: "cascade",
      });
    }
  }
  OrderItem.init(
    {
      order_id: { type: DataTypes.INTEGER, allowNull: false },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
    }
  );
  return OrderItem;
};
