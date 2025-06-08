import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

// Define the path to the SQLite database file
// It will be created in the root of the project if it doesn't exist.
const DB_FILE_PATH = path.join(process.cwd(), "agritrust_cache.db");

let dbInstance: Database | null = null;

/**
 * Opens and returns a SQLite database connection.
 * If a connection already exists, it returns the existing one.
 * Applies migrations if the database is newly created or needs updates.
 * @returns Promise<Database>
 */
export async function getDB(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const db = await open({
      filename: DB_FILE_PATH,
      driver: sqlite3.Database,
    });

    console.log("Connected to SQLite database:", DB_FILE_PATH);

    // Enable foreign key support
    await db.exec("PRAGMA foreign_keys = ON;");

    // TODO: Implement a more robust migration system.
    // For now, we can apply the schema directly if tables don't exist.
    // This is a simplified approach. A proper migration tool (e.g., node-pg-migrate adapted for sqlite, or custom logic)
    // would be better for managing schema changes over time.
    // The schema is defined in supabase/schema.sql

    // Example: Check if 'project_cache' table exists, if not, run schema.
    // This is a very basic way to "migrate".
    const projectCacheTable = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='project_cache';"
    );

    if (!projectCacheTable) {
      console.log(
        "Tables not found, attempting to apply schema from supabase/schema.sql..."
      );
      // In a real scenario, you would read the schema.sql file and execute it.
      // For this environment, we'll assume the user/CI process handles schema creation
      // or we'd need a tool to read and execute SQL files.
      // For now, we'll log a warning if tables are missing.
      console.warn(
        "Database schema might not be initialized. Please ensure supabase/schema.sql has been applied."
      );
      // A more robust solution would be to read and execute the schema.sql file here.
      // const fs = require('fs');
      // const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'supabase/schema.sql'), 'utf-8');
      // await db.exec(schemaSQL);
      // console.log("Schema applied successfully.");
    }

    dbInstance = db;
    return db;
  } catch (error) {
    console.error("Error connecting to SQLite database:", error);
    throw new Error(`Failed to connect to SQLite database: ${error}`);
  }
}

/**
 * Closes the database connection if it's open.
 */
export async function closeDB(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log("SQLite database connection closed.");
  }
}

// Example usage (can be removed or kept for testing):
// async function testDB() {
//   try {
//     const db = await getDB();
//     // Perform some test query
//     const row = await db.get("SELECT sqlite_version() as version;");
//     console.log("SQLite version:", row.version);
//     await closeDB();
//   } catch (error) {
//     console.error("DB test failed:", error);
//   }
// }
// testDB();

// Export the type for convenience if needed elsewhere
export type SQLiteDB = Database;