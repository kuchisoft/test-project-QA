import { test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

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

  fs.writeFileSync("./test-results/query_output.json", JSON.stringify(result, null, 2));
});
