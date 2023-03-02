-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tfa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tfa_pending" BOOLEAN NOT NULL DEFAULT false;
