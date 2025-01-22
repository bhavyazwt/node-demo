const fs = require("fs");
const createFileUtility = require("./utilityFunctions/createFile");
const fileName = process.argv[2];
const fileText = process.argv[3];

function fileExist(fileName) {
  return fs.readdirSync("../").filter((file) => file === fileName);
}

try {
  //   Creating File
  const writeStream = createFileUtility(fileName);
  if (!writeStream) throw "Error Creating File";
  //   Writing File
  console.log("Now Writing the File");
  const writeStreamOutput = writeStream.write(fileText);

  if (!writeStreamOutput) {
    throw "Error Writing the file";
  } else {
    console.log("File Written Successfully");
  }
} catch (err) {
  console.log(err);
}

module.exports.createFile = { createFile };
