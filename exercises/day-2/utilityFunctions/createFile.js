const fs = require("fs");
const path = require("path");

const charactersNotAllowed = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

function createFileUtility(fileName, confirm = "false") {
  try {
    const fileExtension = fileName.split(".").pop();

    //   Validating Proper File Extension and File Name
    if (fileExtension !== "txt") {
      throw "Add Proper File Extension, Only .txt is permitted";
    } else if (charactersNotAllowed.test(fileName)) {
      throw "Special Characters Are Not Allowed In File Name";
    } else {
      if (fs.existsSync(`./${fileName}`) && confirm !== "true") {
        // console.log(confirm);
        throw "File Already Exists, If You want to override use confirm=true param";
      }
      console.log("Valid File Format, Now Creating The File.........");
      const writeStream = fs.createWriteStream(fileName);
      console.log(`File Created With Name ${fileName}`);
      return writeStream;
    }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { createFileUtility };
