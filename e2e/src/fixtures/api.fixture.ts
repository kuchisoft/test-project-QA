import { APIRequestContext, test as base } from "@playwright/test";

export interface BookingResponse {
  additionalneeds: string;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  depositpaid: boolean;
  firstname: string;
  lastname: string;
  totalprice: number;
}

type BookingFixtures = {
  bookingData: BookingResponse;
  bookingRequest: APIRequestContext;
};

export const test = base.extend<BookingFixtures>({
  bookingRequest: async ({ request }, use) => {
    await use(request);
  },
});

export { expect } from "@playwright/test";
