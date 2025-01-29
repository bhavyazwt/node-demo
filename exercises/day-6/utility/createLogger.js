const fs = require("fs");
const path = require("path");
function logger(log) {
  try {
    fs.appendFile(
      path.join(__dirname, "..", "log.txt"),
      `\r\n${log}`,
      (err) => {
        if (err) throw err;
      }
    );
    return true;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = logger;
