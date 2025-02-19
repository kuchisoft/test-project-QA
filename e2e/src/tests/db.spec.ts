import prisma from "../../prisma";
import { loginTest as test } from "../fixtures/loginPage.fixture";

test("SQL fill data @db", async ({}) => {

  await prisma.$executeRaw`INSERT OR IGNORE INTO Clients (client_id, client_name, address, phone) VALUES
  (1, 'ABC Corp', '123 Main St', '555-1234'),
  (2, 'XYZ Inc', '456 Elm St', '555-5678'),
  (3, 'ACME LLC', '789 Oak St', '555-9012');`;

  await prisma.$executeRaw`INSERT OR IGNORE INTO Users (user_id, username, password, registration_date, client_id) VALUES
  (1, 'john_doe', 'pass123', '2020-01-15', 1),
  (2, 'jane_smith', 'pass456', '2020-02-20', 2),
  (3, 'alice_jones', 'pass789', '2020-03-25', 1),
  (4, 'bob_brown', 'pass101', '2020-04-30', 3),
  (5, 'charlie_white', 'pass112', '2020-05-10', NULL);`;

  await prisma.$executeRaw`INSERT OR IGNORE INTO Orders (order_id, user_id, client_id, order_date, total_amount) VALUES
  (1, 1, 1, '2020-02-01', 1000.00),
  (2, 2, 2, '2020-03-05', 1500.00),
  (3, 3, 1, '2020-03-20', 2000.00),
  (4, 4, 3, '2020-04-15', 2500.00),
  (5, 1, 1, '2020-05-01', 3000.00);`;

  await prisma.$executeRaw`INSERT OR IGNORE INTO Products (product_id, product_name, price) VALUES
  (1, 'Widget', 10.00),
  (2, 'Gadget', 20.00),
  (3, 'Thingamajig', 30.00);`;

  await prisma.$executeRaw`INSERT OR IGNORE INTO OrderItems (order_id, product_id, quantity) VALUES
  (1, 1, 50),
  (1, 2, 25),
  (2, 2, 50),
  (3, 1, 100),
  (3, 3, 20),
  (4, 2, 75),
  (5, 3, 100);`;

  console.log("Data inserted successfully");
});

test("SQL query test @db", async ({}) => {
  const result = await prisma.$queryRaw`
    SELECT u.username, SUM(oi.quantity) AS total_items
    FROM Users u
    JOIN Orders o ON u.user_id = o.user_id
    JOIN OrderItems oi ON o.order_id = oi.order_id
    JOIN Products p ON oi.product_id = p.product_id
    WHERE p.product_name = 'Widget' AND o.order_date >= '2020-05-01'
    GROUP BY u.username
    HAVING SUM(oi.quantity) > 50;
  `;
  console.log(result);
});
