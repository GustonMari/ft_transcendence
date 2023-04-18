-- CreateTable
CREATE TABLE "game_history" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_1" INTEGER NOT NULL,
    "user_1_score" INTEGER NOT NULL,
    "user_2" INTEGER NOT NULL,
    "user_2_score" INTEGER NOT NULL,

    CONSTRAINT "game_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_history_id_key" ON "game_history"("id");

-- AddForeignKey
ALTER TABLE "game_history" ADD CONSTRAINT "game_history_user_1_fkey" FOREIGN KEY ("user_1") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_history" ADD CONSTRAINT "game_history_user_2_fkey" FOREIGN KEY ("user_2") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
