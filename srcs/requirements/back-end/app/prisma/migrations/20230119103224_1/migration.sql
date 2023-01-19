/*
  Warnings:

  - You are about to drop the column `fr_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[author_id]` on the table `friend_request_list` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `friend_request_list` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_fr_id_fkey";

-- DropIndex
DROP INDEX "users_fr_id_key";

-- AlterTable
ALTER TABLE "friend_request_list" ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "fr_id";

-- CreateIndex
CREATE UNIQUE INDEX "friend_request_list_author_id_key" ON "friend_request_list"("author_id");

-- AddForeignKey
ALTER TABLE "friend_request_list" ADD CONSTRAINT "friend_request_list_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
