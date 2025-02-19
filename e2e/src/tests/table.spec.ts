import { tableTest as test } from "../fixtures/tablePage.fixture";

test("should add and delete a record @tables", async ({ TablePage }) => {
 
  const recordData = {
    client_name: "John Doe",
    address: "123 Main St",
    phone: "555-1234",
  };
 
  await TablePage.goto();
  await TablePage.addRecord(recordData);
  await TablePage.verifyRecordExists("John Doe");

  await TablePage.deleteRecord("John Doe");
  await TablePage.verifyRecordDeleted("John Doe");
});