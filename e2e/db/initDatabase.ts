/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Database, open } from "sqlite";
// import sqlite3 from "sqlite3";

import prisma from "../prisma";

async function main() {
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

  console.log("Data inserted successfully!");
}

main()
  .catch(() => {
    console.error();
  })
  .finally();
