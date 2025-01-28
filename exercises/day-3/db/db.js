const mysql = require("mysql2");
require("dotenv").config();

let pool;

function initializeDB() {
  try {
    if (!pool) {
      pool = mysql
        .createPool({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USERNAME,
          database: process.env.MYSQL_DBNAME,
          password: process.env.MYSQL_PASSWORD,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        })
        .promise();
      console.log("Database pool initialized");
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function getConnection() {
  try {
    if (!pool) {
      initializeDB();
    }
    const connection = await pool.getConnection();
    console.log("Database connection established");
    return connection;
  } catch (err) {
    console.error("Error getting DB connection:", err.message);
    throw new Error("Database connection failed");
  }
}

function closePool() {
  if (pool) {
    pool
      .end()
      .then(() => {
        console.log("Database pool closed");
      })
      .catch((err) => {
        console.error("Error closing DB pool:", err.message);
      });
  }
}

module.exports = { initializeDB, getConnection, closePool };
