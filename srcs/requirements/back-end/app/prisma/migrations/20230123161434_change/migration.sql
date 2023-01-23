/*
  Warnings:

  - The values [ACCEPTED,REJECTED] on the enum `RELATION_STATE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RELATION_STATE_new" AS ENUM ('PENDING', 'FRIEND', 'BLOCKED');
ALTER TABLE "friend_request" ALTER COLUMN "state" TYPE "RELATION_STATE_new" USING ("state"::text::"RELATION_STATE_new");
ALTER TYPE "RELATION_STATE" RENAME TO "RELATION_STATE_old";
ALTER TYPE "RELATION_STATE_new" RENAME TO "RELATION_STATE";
DROP TYPE "RELATION_STATE_old";
COMMIT;
