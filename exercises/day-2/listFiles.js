const fs = require("fs");

const nodeDemoDayOneFolder = "../day-1";

function listFiles(filePath) {
  const files = fs
    .readdirSync(filePath, { withFileTypes: true })
    .filter((file) => file.isFile);
  return files;
}

function printFiles() {
  const fileList = listFiles(nodeDemoDayOneFolder);
  if (fileList.length) {
    fileList.forEach((file) => {
      console.log(file);
    });
  } else {
    console.log("No File Exists");
  }
}

printFiles();
// module.exports = { listFiles };
