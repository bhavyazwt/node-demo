"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Product }) {
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Product, { foreignKey: "product_id" });
    }
  }
  Wishlist.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "Wishlist",
    }
  );
  return Wishlist;
};
