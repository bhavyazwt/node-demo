"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Product }) {
      this.belongsTo(User, { foreignKey: "user_id", onDelete: "cascade" });
      this.belongsTo(Product, {
        foreignKey: "product_id",
        onDelete: "cascade",
      });
    }
  }
  Cart.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "cart",
    }
  );
  return Cart;
};
