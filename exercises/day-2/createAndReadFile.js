const fs = require("fs");
const http = require("http");

const fileName = process.argv[2];
const fileText = process.argv[3];

function createFile() {
  const writeStream = fs.createWriteStream(fileName);
  console.log(`File Created With Name ${fileName} `);
  if (!writeStream) {
    throw "Error Creating File";
  } else {
    return writeStream;
  }
}

try {
  const fileExtension = fileName.split(".").pop();

  //   Validating Proper File Extension
  if (fileExtension !== "txt") {
    throw "Add Proper File Extension, Only .txt is permitted";
  }

  //   Creating File
  const writeStream = createFile(fileName);

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

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    try {
      const fileContent = fs.readFileSync(
        fileName,
        "utf8",
        function (err, data) {
          if (err) {
            throw err;
          }
          return data;
        }
      );
      res.write(fileContent);
      res.end();
    } catch (err) {
      console.log(err);
    }
  })
  .listen(5050);
