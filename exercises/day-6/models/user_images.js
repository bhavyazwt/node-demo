"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User);
    }
  }
  UserImages.init(
    {
      imageName: { type: DataTypes.STRING, allowNull: false },
      path: { type: DataTypes.STRING, allowNull: false },
      mimeType: { type: DataTypes.STRING, allowNull: false },
      extension: { type: DataTypes.STRING, allowNull: false },
      size: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "UserImages",
      tableName: "users_images",
    }
  );
  return UserImages;
};
