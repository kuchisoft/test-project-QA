import { test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

test("SQL fill data @db", async ({}) => {
  await prisma.orderItems.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.users.deleteMany();
  await prisma.clients.deleteMany();
  await prisma.products.deleteMany();

  await prisma.clients.createMany({
    data: [
      { client_id: 1, client_name: "ABC Corp", address: "123 Main St", phone: "555-1234" },
      { client_id: 2, client_name: "XYZ Inc", address: "456 Elm St", phone: "555-5678" },
      { client_id: 3, client_name: "ACME LLC", address: "789 Oak St", phone: "555-9012" }
    ],
  });

  await prisma.users.createMany({
    data: [
      { user_id: 1, username: "john_doe", password: "pass123", registration_date: new Date("2020-01-15"), client_id: 1 },
      { user_id: 2, username: "jane_smith", password: "pass456", registration_date: new Date("2020-02-20"), client_id: 2 },
      { user_id: 3, username: "alice_jones", password: "pass789", registration_date: new Date("2020-03-25"), client_id: 1 },
      { user_id: 4, username: "bob_brown", password: "pass101", registration_date: new Date("2020-04-30"), client_id: 3 },
      { user_id: 5, username: "charlie_white", password: "pass112", registration_date: new Date("2020-05-10"), client_id: null },
      { user_id: 6, username: "standard_user", password: "secret_sauce", registration_date: new Date("2020-04-30"), client_id: 3 }
    ],
  });

  await prisma.orders.createMany({
    data: [
      { order_id: 1, user_id: 1, client_id: 1, order_date: new Date("2020-02-01"), total_amount: 1000.0 },
      { order_id: 2, user_id: 2, client_id: 2, order_date: new Date("2020-03-05"), total_amount: 1500.0 },
      { order_id: 3, user_id: 3, client_id: 1, order_date: new Date("2020-03-20"), total_amount: 2000.0 },
      { order_id: 4, user_id: 4, client_id: 3, order_date: new Date("2020-04-15"), total_amount: 2500.0 },
      { order_id: 5, user_id: 1, client_id: 1, order_date: new Date("2020-05-01"), total_amount: 3000.0 }
    ],
  });

  await prisma.products.createMany({
    data: [
      { product_id: 1, product_name: "Widget", price: 10.0 },
      { product_id: 2, product_name: "Gadget", price: 20.0 },
      { product_id: 3, product_name: "Thingamajig", price: 30.0 }
    ],
  });

  await prisma.orderItems.createMany({
    data: [
      { order_id: 1, product_id: 1, quantity: 50 },  
      { order_id: 1, product_id: 2, quantity: 25 }, 
      { order_id: 2, product_id: 2, quantity: 50 }, 
      { order_id: 3, product_id: 1, quantity: 100 },
      { order_id: 3, product_id: 3, quantity: 20 },  
      { order_id: 4, product_id: 2, quantity: 75 },  
      { order_id: 5, product_id: 3, quantity: 100 } 
    ],
  });

});

test("SQL query test @db", async ({}) => {

  const result = await prisma.orders.findMany({
    where: {
      order_date: { lte: new Date("2020-05-01") },
      OrderItems: {
        some: {
          quantity: { gt: 50 }, 
          Products: { product_name: "Widget" }
        }
      }
    },
    select: {
      Users: { select: { username: true } },
      OrderItems: {
        where: {
          Products: { product_name: "Widget" } 
        },
        select: {
          quantity: true,
          Products: { select: { product_name: true } }
        }
      }
    }
  });

  fs.writeFileSync("query_output.json", JSON.stringify(result, null, 2));
});
