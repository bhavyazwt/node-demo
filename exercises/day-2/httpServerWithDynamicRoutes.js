// Loading the Environment Variables
require("dotenv").config();
// Inbuilt Modules
const http = require("http");
const url = require("node:url");
const fs = require("fs");

// Custom Utility Functions
const { listFiles } = require("./listFiles");
const { createFileUtility } = require("./utilityFunctions/createFile");
const { appendFileUtility } = require("./utilityFunctions/appendFile");
const filesPath = "./files";
const host = "http://127.0.0.1:5050";

console.log(host);
function getSearchParams(req, requestedParam) {
  const testURL = new URL(`${host}${req.url}`);
  const paramValue = testURL.searchParams.get(requestedParam);

  return paramValue;
}

function defaultResponse(req, res) {
  res.write(
    "Welcome to the file System Please use /list, /file, /create, /append , /delete"
  );
  res.end();
}
function errorResponse(req, res) {
  res.write("Invalid Path");
  res.end();
}

function listAndSendFileNames(req, res, filesPath) {
  console.log(filesPath);
  const files = listFiles(filesPath);
  let responseBody = "";
  for (let file of files) responseBody += `${file}, `;
  res.write(responseBody);
  res.end();
}

function readFile(req, res) {
  const fileName = getSearchParams(req, "name");
  console.log(fileName);
  if (fileName.endsWith(".txt")) {
    try {
      const fileContent = fs.readFileSync(
        `${filesPath}/${fileName}`,
        "utf8",
        function (err, data) {
          if (err) {
            throw err;
          }
          return data;
        }
      );
      res.write(fileContent);
    } catch (err) {
      res.write(err.message.split(",")[0]);
    }
  } else {
    res.write("Invalid File Format ");
  }
  res.end();
}

function createFile(req, res) {
  try {
    const fileName = getSearchParams(req, "name");
    const filePointer = createFileUtility(fileName);
    if (!filePointer) throw "Error Creating File";
    const fileContent = getSearchParams(req, "content");
    filePointer.write(fileContent);
    res.write("File Created And Content Added SuccessFully");
    res.end();
  } catch (err) {
    res.write(err.message);
    res.end();
  }
}

function appendFile(req, res) {
  try {
    const fileName = getSearchParams(req, "name");
    const fileContent = getSearchParams(req, "content");
    const newFileParam = getSearchParams(req, "new");

    const isAppendSuccess = appendFileUtility(
      `./${fileName}`,
      fileContent,
      newFileParam
    );
    if (isAppendSuccess) {
      res.write("File Appended Successfully");
      res.end();
    } else {
      res.write("Error Appending File");
      res.end();
    }
  } catch (err) {
    res.write(err.message);
    res.end();
  }
}

function deleteFile(req, res) {
  const fileName = getSearchParams(req, "name");
  try {
    fs.unlink(`${filesPath}/${fileName}`, (err) => {
      if (err) {
        res.write("Please Delete A Valid File, Directories Are NOT Allowed. ");
        res.write(err?.message?.split(",")[0]);
        res.end();
      } else {
        res.write("File Deleted Successfully");
        res.end();
      }
    });
  } catch (err) {
    res.write(err?.message);
    res.end();
  }
}
function routerFunction(req, res) {
  switch (req.url.split("?")[0]) {
    case "/":
      defaultResponse(req, res);
      break;
    case "/list":
      listAndSendFileNames(req, res, filesPath);
      break;
    case "/file":
      readFile(req, res);
      break;
    case "/create":
      createFile(req, res);
      break;
    case "/append":
      appendFile(req, res);
      break;
    case "/delete":
      deleteFile(req, res);
      break;
    default:
      errorResponse(req, res);
  }
}

http
  .createServer(function (req, res) {
    routerFunction(req, res);
  })
  .listen(5050, (error) => {
    if (error) {
      return console.error(error);
    }

    console.log(`Server listening on port ${5050}`);
  });
