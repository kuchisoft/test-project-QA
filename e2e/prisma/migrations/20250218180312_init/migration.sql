-- CreateTable
CREATE TABLE "appuser" (
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
CREATE TABLE "role" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "appuser_role" (
    "appuser_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    PRIMARY KEY ("appuser_id", "role_id"),
    CONSTRAINT "appuser_role_appuser_id_fkey" FOREIGN KEY ("appuser_id") REFERENCES "appuser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appuser_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "appuser_username_key" ON "appuser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");
