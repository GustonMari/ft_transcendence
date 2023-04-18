/*
  Warnings:

  - You are about to drop the column `user_1` on the `game_history` table. All the data in the column will be lost.
  - You are about to drop the column `user_2` on the `game_history` table. All the data in the column will be lost.
  - Added the required column `user_1_id` to the `game_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_2_id` to the `game_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "game_history" DROP CONSTRAINT "game_history_user_1_fkey";

-- DropForeignKey
ALTER TABLE "game_history" DROP CONSTRAINT "game_history_user_2_fkey";

-- AlterTable
ALTER TABLE "game_history" DROP COLUMN "user_1",
DROP COLUMN "user_2",
ADD COLUMN     "user_1_id" INTEGER NOT NULL,
ADD COLUMN     "user_2_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "game_history" ADD CONSTRAINT "game_history_user_1_id_fkey" FOREIGN KEY ("user_1_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_history" ADD CONSTRAINT "game_history_user_2_id_fkey" FOREIGN KEY ("user_2_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
