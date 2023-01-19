/*
  Warnings:

  - You are about to drop the `friendRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friendRequestList` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fr_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "friendRequest" DROP CONSTRAINT "friendRequest_listId_fkey";

-- DropForeignKey
ALTER TABLE "friendRequestList" DROP CONSTRAINT "friendRequestList_authorId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fr_id" INTEGER;

-- DropTable
DROP TABLE "friendRequest";

-- DropTable
DROP TABLE "friendRequestList";

-- CreateTable
CREATE TABLE "friend_request" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "friend_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_request_list" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "friend_request_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friend_request_id_key" ON "friend_request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "friend_request_list_id_key" ON "friend_request_list"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_fr_id_key" ON "users"("fr_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fr_id_fkey" FOREIGN KEY ("fr_id") REFERENCES "friend_request_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;
