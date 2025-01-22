const fs = require("fs");

function appendFileUtility(filePath, fileContent, newParam) {
  try {
    if (!fs.existsSync(filePath) && newParam !== "true") {
      throw "File Doesn't exist! If you still want to make a new file append, new=true in URL";
    } else {
      fs.appendFile(filePath, fileContent, (err) => {
        if (err) throw err;
      });
      return true;
    }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { appendFileUtility };
