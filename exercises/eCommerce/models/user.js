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
          role: user.role,
        },
        ACCESS_TOKEN.secret,
        {
          expiresIn: ACCESS_TOKEN.expiry,
        }
      );

      return accessToken;
    };

    static associate({ Cart, Order, Wishlist }) {
      this.hasOne(Cart);
      this.hasMany(Order);
      this.hasOne(Wishlist);
    }
  }
  User.init(
    {
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "customer"),
        defaultValue: "customer",
      },
      token: { type: DataTypes.STRING },
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
