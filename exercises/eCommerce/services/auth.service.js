const { User } = require("../models");

/**
 *
 * @param {string} first_name - user's first name
 * @param {string} last_name - user's last name
 * @param {email} email - user's email
 * @param {string} password - user's password
 * @param {string} role  - user's role either 'Customer' or 'Admin' [Default: Customer]
 *
 **/

async function signUpUserService(
  first_name,
  last_name,
  email,
  password,
  role = "customer"
) {
  try {
    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      role: role.toLowerCase(),
    });
    if (user) {
      const accessToken = await user.generateAccessToken(); // Create Access Token
      const refreshToken = await user.generateRefreshToken(); // Create Refresh Token
      return [user, accessToken, refreshToken];
    } else {
      throw new Error("Error Creating User");
    }
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      throw new Error("User with email already exists");
    }
    throw new Error(err);
  }
}

/**
 *
 * @param {string} email - user's email
 * @param {string} password - user's password
 *
 **/

async function loginService(email, password) {
  //Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User is not registered!");

  //Check for valid password
  const isPassValid = user.validPassword(password);
  if (!isPassValid) throw new Error("Invalid Email/Password.");

  //Generate Tokens if user exists
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  if (!accessToken || !refreshToken)
    throw new Error("Error Generating Tokens.");

  return [user, accessToken, refreshToken];
}

module.exports = {
  signUpUserService,
  loginService,
};
