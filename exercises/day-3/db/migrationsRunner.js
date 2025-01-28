const fs = require("fs");
const path = require("path");
const { initializeDB, getConnection } = require("./db");

async function runMigrations() {
  try {
    console.log("Running migrations...");
    const migrationsPath = path.join(__dirname, "migrations");
    const migrationFiles = fs.readdirSync(migrationsPath).sort();

    const connection = await getConnection();
    try {
      for (const file of migrationFiles) {
        const filePath = path.join(migrationsPath, file);
        const sql = fs.readFileSync(filePath, "utf-8");
        console.log(`Executing migration: ${file}`);
        await connection.query(sql);
      }
      console.log("Migrations completed successfully.");
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error running migrations:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDB();
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runMigrations };
