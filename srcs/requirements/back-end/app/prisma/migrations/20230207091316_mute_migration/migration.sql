-- AlterTable
ALTER TABLE "UsersOnRooms" ADD COLUMN     "banned_at" TIMESTAMP(3),
ADD COLUMN     "banned_till" TIMESTAMP(3),
ADD COLUMN     "muted_at" TIMESTAMP(3),
ADD COLUMN     "muted_till" TIMESTAMP(3);
