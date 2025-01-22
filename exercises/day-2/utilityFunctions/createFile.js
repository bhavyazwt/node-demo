const fs = require("fs");

const charactersNotAllowed = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

function createFileUtility(fileName) {
  try {
    const fileExtension = fileName.split(".").pop();

    //   Validating Proper File Extension and File Name
    if (fileExtension !== "txt") {
      throw "Add Proper File Extension, Only .txt is permitted";
    } else if (charactersNotAllowed.test(fileName)) {
      throw "Special Characters Are Not Allowed In File Name";
    } else {
      console.log("Valid File Format, Now Creating The File.........");
      const writeStream = fs.createWriteStream(fileName);
      console.log(`File Created With Name ${fileName}`);
      return writeStream;
    }
    // if (fileExist(fileName)) {
    /* 
        TODO: Prompt And Confirm That User Want To Override Existing File. 
      */
    // }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { createFileUtility };
