"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
};
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    toJSON() {
      return { ...this.get(), password: undefined, token: undefined };
    }

    validPassword = async function (password) {
      return await bcrypt.compare(password, this.password);
    };

    generateRefreshToken = async function () {
      const user = this;
      const refreshToken = jwt.sign(
        {
          id: user.id.toString(),
        },
        REFRESH_TOKEN.secret,
        {
          expiresIn: REFRESH_TOKEN.expiry,
        }
      );

      const refreshTknHash = await bcrypt.hash(refreshToken, 10);
      user.token = refreshTknHash;
      await user.save();
      return refreshToken;
    };

    generateAccessToken = async function () {
      const user = this;

      const accessToken = jwt.sign(
        {
          id: user.id.toString(),
          email: user.email,
        },
        ACCESS_TOKEN.secret,
        {
          expiresIn: ACCESS_TOKEN.expiry,
        }
      );

      return accessToken;
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
      token: { type: DataTypes.STRING },
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
