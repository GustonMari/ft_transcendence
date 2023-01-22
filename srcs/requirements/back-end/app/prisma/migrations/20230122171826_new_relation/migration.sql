/*
  Warnings:

  - Added the required column `state` to the `friend_request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RELATION_STATE" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- AlterTable
ALTER TABLE "friend_request" ADD COLUMN     "state" "RELATION_STATE" NOT NULL;

-- DropEnum
DROP TYPE "State";
