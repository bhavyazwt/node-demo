const fs = require("fs");
const nodeDemoDayZeroFolder = "../day-1";
fs.readdir(nodeDemoDayZeroFolder, (err, files) => {
  files.forEach((file) => {
    console.log(file);
  });
});
