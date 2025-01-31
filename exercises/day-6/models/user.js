"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    validPassword = async function (password) {
      return await bcrypt.compare(password, this.password);
    };

    static associate({ UserProfiles, UserImages }) {
      this.hasOne(UserProfiles, { onDelete: "cascade" });
      this.hasMany(UserImages, { onDelete: "cascade" });
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      age: { type: DataTypes.INTEGER, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // set(value) {
        //   this.setDataValue("password"), bcrypt.hash(value);
        // },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });
  User.beforeUpdate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
