require("dotenv").config();
const mysql = require("mysql2/promise");

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
    });

    console.log("Connected to MySQL server.");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DBNAME}\``
    );

    console.log("Database checked/created successfully.");
    await connection.end();
  } catch (err) {
    console.error("Error setting up database:", err);
    throw err;
  }
}
initializeDatabase();
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,
});
console.log(pool);
module.exports = { pool };
