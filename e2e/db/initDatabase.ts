/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

type SQLiteDatabase = Database;

export async function initDatabase(): Promise<SQLiteDatabase | undefined> {
  const db: SQLiteDatabase = await open({
    driver: sqlite3.Database,
    filename: "test.db",
  });

  console.log("Initializing database...");

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS appuser (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        is_deleted INTEGER NOT NULL DEFAULT 0,
        username TEXT NOT NULL UNIQUE,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        nonlocked INTEGER NOT NULL DEFAULT 1,
        enabled INTEGER NOT NULL DEFAULT 1,
        last_time_password_updated TEXT NOT NULL DEFAULT '1970-01-01',
        password_never_expires INTEGER NOT NULL DEFAULT 0,
        cannot_change_password INTEGER NOT NULL DEFAULT 0
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS role (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        is_disabled INTEGER NOT NULL DEFAULT 0
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS appuser_role (
        appuser_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        PRIMARY KEY (appuser_id, role_id),
        FOREIGN KEY (appuser_id) REFERENCES appuser (id),
        FOREIGN KEY (role_id) REFERENCES role (id)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS UserPhone (
        id int NOT NULL AUTO_INCREMENT,
        user_id bigint NOT NULL,
        phone_country_id int NOT NULL,
        phone varchar(20) NOT NULL,
        order_index int NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (appuser_id) REFERENCES appuser (id),
      );
    `);

    console.log("Database initialized successfully!");

    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await db.close();
  }
}

initDatabase().catch((error: unknown) => {
  console.error("Failed to initialize the database:", error);
});
