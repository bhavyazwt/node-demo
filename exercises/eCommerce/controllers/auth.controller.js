const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { signUpUserService, loginService } = require("../services/auth.service");
const { REFRESH_TOKEN } = require("../../../constants");

async function signUp(req, res) {
  try {
    const { first_name, last_name, email, password, role } = req?.body;

    const [user, accessToken, refreshToken] = await signUpUserService(
      first_name,
      last_name,
      email,
      password,
      role
    );
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );
    res.status(201).json({
      user,
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req?.body;
    const [user, accessToken, refreshToken] = await loginService(
      email,
      password
    );
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );
    res.json({
      success: true,
      user,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
}

module.exports = {
  signUp,
  login,
};
