const mysql = require("mysql2");

async function connectDB(DBName) {
  try {
    const pool = mysql
      .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        database: DBName,
        password: process.env.MYSQL_PASSWORD,
      })
      .promise();

    const connection = pool.getConnection();
    if (connection) return connection;
  } catch (err) {
    return err.message ?? "Error Connecting DB";
  }
}

module.exports = { connectDB };
