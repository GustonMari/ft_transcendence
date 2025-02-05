-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('MASTER', 'SLAVE', 'WATCHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "RELATION_STATE" AS ENUM ('PENDING', 'FRIEND', 'BLOCKED');

-- CreateTable
CREATE TABLE "friend_request" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "RELATION_STATE" NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,

    CONSTRAINT "friend_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_request" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "RELATION_STATE" NOT NULL,

    CONSTRAINT "chat_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "forty_two_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "login" TEXT NOT NULL,
    "socket_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "avatar_url" TEXT DEFAULT '/storage/default/user.jpg',
    "email" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT false,
    "description" VARCHAR(200),
    "password" TEXT NOT NULL,
    "rt" TEXT,
    "tfa" BOOLEAN NOT NULL DEFAULT false,
    "tfa_secret" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "loses" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 10,
    "level" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_history" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_1_id" INTEGER NOT NULL,
    "user_1_score" INTEGER NOT NULL,
    "user_2_id" INTEGER NOT NULL,
    "user_2_score" INTEGER NOT NULL,

    CONSTRAINT "game_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "owner" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnRooms" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "muted" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "muted_at" TIMESTAMP(3),
    "muted_till" TIMESTAMP(3),
    "banned_at" TIMESTAMP(3),
    "banned_till" TIMESTAMP(3),

    CONSTRAINT "UsersOnRooms_pkey" PRIMARY KEY ("user_id","room_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "current_message" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInGame" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "GameType" NOT NULL DEFAULT 'WATCHER',
    "user_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "UserInGame_pkey" PRIMARY KEY ("user_id","game_id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "score_left" INTEGER NOT NULL DEFAULT 0,
    "score_right" INTEGER NOT NULL DEFAULT 0,
    "master_id" INTEGER NOT NULL,
    "slave_id" INTEGER NOT NULL,
    "game_over" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitationpong" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sender_player_id" INTEGER NOT NULL,
    "sender_player_login" TEXT NOT NULL,
    "invited_player_id" INTEGER NOT NULL,
    "invited_player_login" TEXT NOT NULL,
    "game_name" TEXT NOT NULL,

    CONSTRAINT "invitationpong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friend_request_id_key" ON "friend_request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_request_id_key" ON "chat_request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_socket_id_key" ON "users"("socket_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_history_id_key" ON "game_history"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_id_key" ON "Room"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "games_id_key" ON "games"("id");

-- CreateIndex
CREATE UNIQUE INDEX "games_name_key" ON "games"("name");

-- CreateIndex
CREATE UNIQUE INDEX "games_master_id_key" ON "games"("master_id");

-- CreateIndex
CREATE UNIQUE INDEX "invitationpong_id_key" ON "invitationpong"("id");

-- CreateIndex
CREATE UNIQUE INDEX "invitationpong_game_name_key" ON "invitationpong"("game_name");

-- AddForeignKey
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_history" ADD CONSTRAINT "game_history_user_1_id_fkey" FOREIGN KEY ("user_1_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_history" ADD CONSTRAINT "game_history_user_2_id_fkey" FOREIGN KEY ("user_2_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnRooms" ADD CONSTRAINT "UsersOnRooms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnRooms" ADD CONSTRAINT "UsersOnRooms_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInGame" ADD CONSTRAINT "UserInGame_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInGame" ADD CONSTRAINT "UserInGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitationpong" ADD CONSTRAINT "invitationpong_sender_player_id_fkey" FOREIGN KEY ("sender_player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitationpong" ADD CONSTRAINT "invitationpong_invited_player_id_fkey" FOREIGN KEY ("invited_player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
