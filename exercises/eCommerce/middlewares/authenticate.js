require("dotenv").config();
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};

const authenticate = (roles) => {
  return function (req, res, next) {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader?.startsWith("Bearer "))
        throw new Error("Authentication Error");

      const accessTokenParts = authHeader.split(" ");
      const accessToken = accessTokenParts[1];

      const decoded = jwt.verify(accessToken, ACCESS_TOKEN.secret);
      console.log(decoded);
      if (roles?.includes(decoded.role)) {
        req.userId = decoded.id;
        req.token = accessToken;
        next();
      } else {
        return res
          .status(403)
          .json({ error: "Unauthorized access, You don't have enough rights" });
      }
    } catch (err) {
      res.status(403).json({ error: "Unauthenticated Access, Login Again" });
    }
  };
};
module.exports = authenticate;
