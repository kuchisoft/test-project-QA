-- CreateTable
CREATE TABLE "AppUser" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nonlocked" BOOLEAN NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "last_time_password_updated" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "password_never_expires" BOOLEAN NOT NULL DEFAULT false,
    "cannot_change_password" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Role" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "AppUserRole" (
    "appuser_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    PRIMARY KEY ("appuser_id", "role_id"),
    CONSTRAINT "AppUserRole_appuser_id_fkey" FOREIGN KEY ("appuser_id") REFERENCES "AppUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AppUserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "UserPhone" (
    "id" int NOT NULL AUTO_INCREMENT,
    "user_id" bigint NOT NULL,
    "phone_country_id" int NOT NULL,
    "phone" varchar(20) NOT NULL,
    "order_index" int NOT NULL,

    PRIMARY KEY ("id"),
    CONSTRAINT "AppUserRole_appuser_id_fkey" FOREIGN KEY ("appuser_id") REFERENCES "AppUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
);


-- CreateIndex
CREATE UNIQUE INDEX "AppUser_username_key" ON "AppUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
