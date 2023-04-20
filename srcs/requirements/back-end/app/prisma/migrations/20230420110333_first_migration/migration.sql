/*
  Warnings:

  - You are about to alter the column `description` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);
