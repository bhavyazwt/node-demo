const { signUpUserService, loginService } = require("../services/auth.service");
const { REFRESH_TOKEN } = require("../../../constants");

/*
 *Register's User and Sends Token on success
 */
async function signUp(req, res) {
  try {
    const { first_name, last_name, email, password, role } = req?.body;

    //Register User
    const [user, accessToken, refreshToken] = await signUpUserService(
      first_name,
      last_name,
      email,
      password,
      role
    );

    //Sending Refresh Token in Cookie
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    //Sending Access Token in JSON Body
    res.status(201).json({
      user,
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/*
 *Login User and Sends Token on success
 */
async function login(req, res) {
  try {
    const { email, password } = req?.body;

    //Checking for Valid Email, Password and Get User Details and Tokens If User is valid
    const [user, accessToken, refreshToken] = await loginService(
      email,
      password
    );

    //Sending Refresh Token in Cookie
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    //Sending Access Token in JSON Body
    res.json({
      user,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  signUp,
  login,
};
