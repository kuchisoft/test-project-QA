import { BookingResponse, expect, test } from "../../fixtures/api.fixture";

test("Api test with bookingRequest fixture (GET)", { tag: ["@api"] }, async ({ bookingRequest }) => {
  const response = await bookingRequest.get("/booking/2666");

  expect(response.status()).toBe(200);

  const responseJson = (await response.json()) as BookingResponse;

  //Site data keeps changing, so the values may not be the same
  expect(responseJson.firstname).toBe("John");
  expect(responseJson.lastname).toBe("Smith");
  expect(responseJson.totalprice).toBe(200);
  expect(responseJson.depositpaid).toBe(false);
  expect(responseJson.bookingdates.checkin).toBe("2023-01-01");
  expect(responseJson.bookingdates.checkout).toBe("2023-01-05");
  expect(responseJson.additionalneeds).toBe("Breakfast");
});

test("Api test with bookingRequest fixture (POST)", { tag: ["@api"] }, async ({ bookingRequest }) => {
  const newBooking = {
    additionalneeds: "breakfast",
    bookingdates: {
      checkin: "2023-01-01",
      checkout: "2023-01-05",
    },
    depositpaid: false,
    firstname: "Jane",
    lastname: "Doe",
    totalprice: 200,
  };

  const response = await bookingRequest.post("/booking", {
    data: newBooking,
    headers: {
      "Content-Type": "application/json",
    },
  });

  expect(response.status()).toBe(200);

  const responseJson = (await response.json()) as { booking: BookingResponse };

  expect(responseJson.booking.firstname).toBe("Jane");
  expect(responseJson.booking.lastname).toBe("Doe");
  expect(responseJson.booking.totalprice).toBe(200);
  expect(responseJson.booking.depositpaid).toBe(false);
  expect(responseJson.booking.bookingdates.checkin).toBe("2023-01-01");
  expect(responseJson.booking.bookingdates.checkout).toBe("2023-01-05");
  expect(responseJson.booking.additionalneeds).toBe("breakfast");
});

test("Api test with bookingRequest fixture (PUT)", { tag: ["@api"] }, async ({ bookingRequest }) => {
  const updatedBooking = {
    additionalneeds: "Breko",
    bookingdates: {
      checkin: "2018-01-01",
      checkout: "2019-01-01",
    },
    depositpaid: true,
    firstname: "Nely",
    lastname: "Mkuch",
    totalprice: 150,
  };

  const response = await bookingRequest.put("/booking/202", {
    data: updatedBooking,
    headers: {
      Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      "Content-Type": "application/json",
    },
  });

  expect(response.status()).toBe(200);

  const responseJson = (await response.json()) as BookingResponse;

  expect(responseJson.firstname).toBe("Nely");
  expect(responseJson.lastname).toBe("Mkuch");
  expect(responseJson.totalprice).toBe(150);
  expect(responseJson.depositpaid).toBe(true);
  expect(responseJson.bookingdates.checkin).toBe("2018-01-01");
  expect(responseJson.bookingdates.checkout).toBe("2019-01-01");
  expect(responseJson.additionalneeds).toBe("Breko");
});
