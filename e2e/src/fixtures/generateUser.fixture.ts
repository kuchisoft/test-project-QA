import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

type GenerateUserFixtures = {
  defaultUserdata: {
    pass: string;
    user: string;
  };
  generatedUser: GeneratedUser;
};

export type GeneratedUser = {
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  password: string;
  username: string;
};

export const generateUserTest = base.extend<GenerateUserFixtures>({
  defaultUserdata: async ({}, use) => {
    await use({ pass: "admin123", user: "Admin" });
  },

  generatedUser: async ({}, use) => {
    const generatedUser: GeneratedUser = {
      employeeId: faker.string.numeric({ length: { max: 7, min: 5 } }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      middleName: faker.person.middleName(),
      password: faker.internet.password({
        length: 10,
        memorable: false,
        pattern: /[A-Za-z0-9!@#$%^&*]/,
      }),
      username: faker.internet.userName(),
    };
    await use(generatedUser);
  },
});

export { expect, test } from "@playwright/test";
