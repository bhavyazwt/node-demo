require("dotenv").config({ path: "../.env" });

console.log(process.env.APP_NAME);
console.log(process.env.APP_ENV);
console.log(process.env.APP_PORT);
console.log(process.env.DEBUG);
