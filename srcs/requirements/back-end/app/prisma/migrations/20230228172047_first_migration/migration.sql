/*
  Warnings:

  - You are about to drop the column `tfa_pending` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "tfa_pending",
ADD COLUMN     "tfa_secret" TEXT;
