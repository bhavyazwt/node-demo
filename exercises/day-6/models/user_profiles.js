"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User);
    }
  }
  UserProfiles.init(
    {
      bio: { type: DataTypes.STRING, allowNull: false },
      linkedInUrl: { type: DataTypes.STRING, allowNull: false },
      facebookUrl: { type: DataTypes.INTEGER, allowNull: false },
      instaUrl: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "UserProfiles",
      tableName: "user_profiles",
    }
  );
  return UserProfiles;
};
