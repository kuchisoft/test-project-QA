-- CreateTable
CREATE TABLE "Clients" (
    "client_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registration_date" DATETIME NOT NULL,
    "client_id" INTEGER,
    CONSTRAINT "Users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients" ("client_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Orders" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "order_date" DATETIME NOT NULL,
    "total_amount" REAL NOT NULL,
    CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Orders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients" ("client_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Products" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_name" TEXT NOT NULL,
    "price" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("order_id", "product_id"),
    CONSTRAINT "OrderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItems_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
