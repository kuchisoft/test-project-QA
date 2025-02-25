/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

type SQLiteDatabase = Database;

export async function initDatabase(): Promise<void> {
  let db: SQLiteDatabase | undefined;

  try {
    db = await open({
      driver: sqlite3.Database,
      filename: "test.db",
    });

    console.log("Initializing database...");

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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        phone_country_id INTEGER NOT NULL,
        phone TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES appuser (id)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        client_id INTEGER PRIMARY KEY,
        client_name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        client_id INTEGER,
        FOREIGN KEY (client_id) REFERENCES clients (client_id)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY,
        client_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        order_date TEXT NOT NULL,
        total_amount REAL NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (client_id),
        FOREIGN KEY (user_id) REFERENCES users (user_id)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INTEGER PRIMARY KEY,
        product_name TEXT NOT NULL,
        price REAL NOT NULL
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (order_id, product_id),
        FOREIGN KEY (order_id) REFERENCES orders (order_id),
        FOREIGN KEY (product_id) REFERENCES products (product_id)
      );
    `);

    await db.exec(`
      INSERT OR REPLACE INTO clients (client_id, client_name, address, phone) VALUES
      (1, 'ABC Corp', '123 Main St', '555-1234'),
      (2, 'XYZ Inc', '456 Elm St', '555-5678'),
      (3, 'ACME LLC', '789 Oak St', '555-9012');
    `);

    await db.exec(`
      INSERT OR REPLACE INTO users (user_id, username, password, registration_date, client_id) VALUES
      (1, 'john_doe', 'pass123', '2020-01-15', 1),
      (2, 'jane_smith', 'pass456', '2020-02-20', 2),
      (3, 'alice_jones', 'pass789', '2020-03-25', 1),
      (4, 'bob_brown', 'pass101', '2020-04-30', 3),
      (5, 'charlie_white', 'pass112', '2020-05-10', NULL),
      (6, 'standard_user', 'secret_sauce', '2020-04-30', 3);
    `);

    await db.exec(`
      INSERT OR REPLACE INTO orders (order_id, client_id, user_id, order_date, total_amount) VALUES
      (1, 1, 1, '2020-02-01', 1000.0),
      (2, 2, 2, '2020-03-05', 1500.0),
      (3, 1, 3, '2020-03-20', 2000.0),
      (4, 3, 4, '2020-04-15', 2500.0),
      (5, 1, 1, '2020-05-01', 3000.0);
    `);

    await db.exec(`
      INSERT OR REPLACE INTO products (product_id, product_name, price) VALUES
      (1, 'Widget', 10.0),
      (2, 'Gadget', 20.0),
      (3, 'Thingamajig', 30.0);
    `);

    await db.exec(`
      INSERT OR REPLACE INTO order_items (order_id, product_id, quantity) VALUES
      (1, 1, 50),
      (1, 2, 25),
      (2, 2, 50),
      (3, 1, 100),
      (3, 3, 20),
      (4, 2, 75),
      (5, 3, 100);
    `);

    console.log("Database initialized and seeded successfully!");
  } catch (error) {
    console.error("Error initializing or seeding database:", error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

initDatabase().catch((error: unknown) => {
  console.error("Failed to initialize the database:", error);
  process.exit(1);
});
