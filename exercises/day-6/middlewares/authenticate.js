require("dotenv").config();
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer "))
      throw new Error("Authentication Error");

    const accessTokenParts = authHeader.split(" ");
    const accessToken = accessTokenParts[1];

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN.secret);

    req.userId = decoded.id;
    req.token = accessToken;
    next();
  } catch (err) {
    res.status(403).json({ error: "Unauthenticated Access, Login Again" });
  }
};
module.exports = authenticate;
