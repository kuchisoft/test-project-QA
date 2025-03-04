import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

type GenerateUserFixtures = {
  generatedUser: GeneratedUser;
};

type GeneratedUser = {
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  password: string;
  username: string;
};

function generatePasswordWithNumber(length = 10): string {
  let password: string;
  do {
    password = faker.internet.password({
      length,
      memorable: false,
      pattern: /[A-Za-z0-9!@#$%^&*]/,
    });
  } while (!/\d/.test(password));
  return password;
}

export const generateUserTest = base.extend<GenerateUserFixtures>({
  generatedUser: [
    async ({}, use) => {
      const generatedUser: GeneratedUser = {
        employeeId: faker.string.numeric({ length: { max: 7, min: 5 } }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        password: generatePasswordWithNumber(10),
        username: faker.internet.userName(),
      };

      await use(generatedUser);
    },
    { scope: "test" },
  ],
});

export { expect, test } from "@playwright/test";
