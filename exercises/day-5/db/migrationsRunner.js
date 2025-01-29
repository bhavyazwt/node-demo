const fs = require("fs");
const path = require("path");
const { pool } = require("../db/db");
async function runMigrations() {
  try {
    console.log("Running migrations...");
    const migrationsPath = path.join(__dirname, "migrations");
    const migrationFiles = fs.readdirSync(migrationsPath).sort();

    try {
      for (const file of migrationFiles) {
        const filePath = path.join(migrationsPath, file);
        const sql = fs.readFileSync(filePath, "utf-8");
        console.log(`Executing migration: ${file}`);
        await pool.query(sql);
      }
      console.log("Migrations completed successfully.");
    } catch (err) {
      console.log(err);
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
