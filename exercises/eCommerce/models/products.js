"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Category, Cart, OrderItem, Wishlist }) {
      this.belongsTo(Category, { foreignKey: "category_id" });
      this.hasMany(Cart);
      this.hasMany(OrderItem);
      this.hasMany(Wishlist);
    }
  }
  Product.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
      image_url: { type: DataTypes.STRING(500) },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    }
  );
  return Product;
};
