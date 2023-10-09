/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `GameMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameMembership_userId_gameId_key" ON "GameMembership"("userId", "gameId");
