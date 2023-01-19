/*
  Warnings:

  - The primary key for the `friend_request_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `friend_request_list` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[list_id]` on the table `friend_request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_frl]` on the table `friend_request_list` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `list_id` to the `friend_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "friend_request_list_id_key";

-- AlterTable
ALTER TABLE "friend_request" ADD COLUMN     "list_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "friend_request_list" DROP CONSTRAINT "friend_request_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_frl" SERIAL NOT NULL,
ADD CONSTRAINT "friend_request_list_pkey" PRIMARY KEY ("id_frl");

-- CreateIndex
CREATE UNIQUE INDEX "friend_request_list_id_key" ON "friend_request"("list_id");

-- CreateIndex
CREATE UNIQUE INDEX "friend_request_list_id_frl_key" ON "friend_request_list"("id_frl");

-- AddForeignKey
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "friend_request_list"("id_frl") ON DELETE RESTRICT ON UPDATE CASCADE;
