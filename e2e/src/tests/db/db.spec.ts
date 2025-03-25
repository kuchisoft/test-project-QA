import { test } from "@playwright/test";

import prisma from "../../../prisma";

test("SQL query test @db", async ({}) => {
  const result = await prisma.users.findMany({
    select: {
      Orders: {
        select: {
          OrderItems: {
            select: {
              quantity: true,
            },
            where: {
              Products: {
                product_name: "Widget",
              },
            },
          },
        },
        where: {
          order_date: {
            lte: new Date("2020-05-01"),
          },
        },
      },
      username: true,
    },
    where: {
      Orders: {
        some: {
          order_date: {
            lte: new Date("2020-05-01"),
          },
          OrderItems: {
            some: {
              Products: {
                product_name: "Widget",
              },
              quantity: {
                gt: 50,
              },
            },
          },
        },
      },
    },
  });

  const formattedResult = result.map((user) => ({
    totalWidgets: user.Orders.flatMap((order) => order.OrderItems).reduce((sum, item) => sum + item.quantity, 0),
    username: user.username,
  }));

  console.log(formattedResult);
});
