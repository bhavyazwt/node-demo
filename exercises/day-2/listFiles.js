const fs = require("fs");

const nodeDemoDayOneFolder = "../day-1";

function listFiles(filePath) {
  const files = fs.readdirSync(filePath);
  return files;
}

function printFiles() {
  const fileList = listFiles(nodeDemoDayOneFolder);
  fileList.forEach((file) => {
    console.log(file);
  });
}

printFiles();
// module.exports = { listFiles };
