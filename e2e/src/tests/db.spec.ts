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
      { address: "123 Main St", client_id: 1, client_name: "ABC Corp", phone: "555-1234" },
      { address: "456 Elm St", client_id: 2, client_name: "XYZ Inc", phone: "555-5678" },
      { address: "789 Oak St", client_id: 3, client_name: "ACME LLC", phone: "555-9012" },
    ],
  });

  await prisma.users.createMany({
    data: [
      { client_id: 1, password: "pass123", registration_date: new Date("2020-01-15"), user_id: 1, username: "john_doe" },
      { client_id: 2, password: "pass456", registration_date: new Date("2020-02-20"), user_id: 2, username: "jane_smith" },
      { client_id: 1, password: "pass789", registration_date: new Date("2020-03-25"), user_id: 3, username: "alice_jones" },
      { client_id: 3, password: "pass101", registration_date: new Date("2020-04-30"), user_id: 4, username: "bob_brown" },
      { client_id: null, password: "pass112", registration_date: new Date("2020-05-10"), user_id: 5, username: "charlie_white" },
      { client_id: 3, password: "secret_sauce", registration_date: new Date("2020-04-30"), user_id: 6, username: "standard_user" },
    ],
  });

  await prisma.orders.createMany({
    data: [
      { client_id: 1, order_date: new Date("2020-02-01"), order_id: 1, total_amount: 1000.0, user_id: 1 },
      { client_id: 2, order_date: new Date("2020-03-05"), order_id: 2, total_amount: 1500.0, user_id: 2 },
      { client_id: 1, order_date: new Date("2020-03-20"), order_id: 3, total_amount: 2000.0, user_id: 3 },
      { client_id: 3, order_date: new Date("2020-04-15"), order_id: 4, total_amount: 2500.0, user_id: 4 },
      { client_id: 1, order_date: new Date("2020-05-01"), order_id: 5, total_amount: 3000.0, user_id: 1 },
    ],
  });

  await prisma.products.createMany({
    data: [
      { price: 10.0, product_id: 1, product_name: "Widget" },
      { price: 20.0, product_id: 2, product_name: "Gadget" },
      { price: 30.0, product_id: 3, product_name: "Thingamajig" },
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
      { order_id: 5, product_id: 3, quantity: 100 },
    ],
  });
});

test("SQL query test @db", async ({}) => {
  const result = await prisma.orders.findMany({
    select: {
      OrderItems: {
        select: {
          Products: { select: { product_name: true } },
          quantity: true,
        },
        where: {
          Products: { product_name: "Widget" },
        },
      },
      Users: { select: { username: true } },
    },
    where: {
      order_date: { lte: new Date("2020-05-01") },
      OrderItems: {
        some: {
          Products: { product_name: "Widget" },
          quantity: { gt: 50 },
        },
      },
    },
  });

  fs.writeFileSync("query_output.json", JSON.stringify(result, null, 2));
});
