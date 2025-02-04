const { User } = require("../models");

async function signUpUserService(first_name, last_name, email, password, role) {
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

async function loginService(email, password) {
  try {
    //Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error({ error: "User is not registered!" });

    //Check for valid password
    const isPassValid = user.validPassword(email, password);
    if (!isPassValid) throw new Error({ error: "Invalid Email/Password." });

    //Generate Tokens if user exists
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return [user, accessToken, refreshToken];
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  signUpUserService,
  loginService,
};
