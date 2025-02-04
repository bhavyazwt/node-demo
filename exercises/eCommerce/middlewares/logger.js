const logger = require("../utility/createLogger");
function loggerMiddleWare(req, res, next) {
  const date = new Date();
  //   console.log(req.method, req.url, Date.now());
  logger(`${req.method} ${req.url} ${date}`);
  next();
}

module.exports = loggerMiddleWare;
