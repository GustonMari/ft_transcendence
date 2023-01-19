/*
  Warnings:

  - You are about to drop the column `id_user` on the `friend_request` table. All the data in the column will be lost.
  - You are about to drop the column `list_id` on the `friend_request` table. All the data in the column will be lost.
  - You are about to drop the `friend_request_list` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `from_id` to the `friend_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `friend_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "friend_request" DROP CONSTRAINT "friend_request_list_id_fkey";

-- DropForeignKey
ALTER TABLE "friend_request_list" DROP CONSTRAINT "friend_request_list_author_id_fkey";

-- DropIndex
DROP INDEX "friend_request_list_id_key";

-- AlterTable
ALTER TABLE "friend_request" DROP COLUMN "id_user",
DROP COLUMN "list_id",
ADD COLUMN     "from_id" INTEGER NOT NULL,
ADD COLUMN     "to_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "friend_request_list";

-- AddForeignKey
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
