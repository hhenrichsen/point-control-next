/*
  Warnings:

  - Added the required column `lifetimeTags` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GamePermission" AS ENUM ('ADMIN', 'EDIT', 'PLAY', 'VIEW');

-- CreateEnum
CREATE TYPE "GameEventType" AS ENUM ('TAG', 'EDIT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lifetimeTags" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Game" (
    "id" VARCHAR(32) NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ownerId" VARCHAR(32) NOT NULL,
    "public" BOOLEAN NOT NULL,
    "discordGuildId" VARCHAR(32),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "defaultRoleId" VARCHAR(32) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAward" (
    "id" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gameId" VARCHAR(32),
    "silver" INTEGER NOT NULL,
    "gold" INTEGER NOT NULL,
    "diamond" INTEGER NOT NULL,
    "obsidian" INTEGER NOT NULL,

    CONSTRAINT "GameAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAwardee" (
    "id" VARCHAR(32) NOT NULL,
    "awardId" VARCHAR(32) NOT NULL,
    "count" INTEGER NOT NULL,
    "userId" VARCHAR(32) NOT NULL,

    CONSTRAINT "GameAwardee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRole" (
    "id" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(8) NOT NULL,
    "position" INTEGER NOT NULL,
    "permissions" "GamePermission"[],
    "gameId" VARCHAR(32) NOT NULL,

    CONSTRAINT "GameRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "color" VARCHAR(8) NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "points" INTEGER NOT NULL,
    "discordRoleId" VARCHAR(32) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMembership" (
    "id" VARCHAR(32) NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "userId" VARCHAR(32) NOT NULL,
    "roleId" VARCHAR(32) NOT NULL,
    "teamId" VARCHAR(32) NOT NULL,
    "fakeTeamId" VARCHAR(32),
    "approved" BOOLEAN NOT NULL,
    "requestDate" TIMESTAMP(3),
    "joined" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePost" (
    "id" VARCHAR(32) NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "GamePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagCode" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "userId" VARCHAR(32) NOT NULL,

    CONSTRAINT "TagCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" SERIAL NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "type" "GameEventType" NOT NULL,
    "occurred" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB NOT NULL,

    CONSTRAINT "GameEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameItem" (
    "id" VARCHAR(32) NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "GameItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameCheckout" (
    "id" VARCHAR(32) NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "inventoryId" VARCHAR(32) NOT NULL,
    "userId" VARCHAR(32) NOT NULL,
    "checkedOutAt" TIMESTAMP(3) NOT NULL,
    "checkedInAt" TIMESTAMP(3),

    CONSTRAINT "GameCheckout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Game_defaultRoleId_key" ON "Game"("defaultRoleId");

-- CreateIndex
CREATE INDEX "Game_slug_idx" ON "Game"("slug");

-- CreateIndex
CREATE INDEX "Game_ownerId_idx" ON "Game"("ownerId");

-- CreateIndex
CREATE INDEX "GameAwardee_userId_idx" ON "GameAwardee"("userId");

-- CreateIndex
CREATE INDEX "GameRole_gameId_idx" ON "GameRole"("gameId");

-- CreateIndex
CREATE INDEX "Team_gameId_idx" ON "Team"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_gameId_slug_key" ON "Team"("gameId", "slug");

-- CreateIndex
CREATE INDEX "GameMembership_gameId_idx" ON "GameMembership"("gameId");

-- CreateIndex
CREATE INDEX "GameMembership_userId_idx" ON "GameMembership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TagCode_code_key" ON "TagCode"("code");

-- CreateIndex
CREATE INDEX "TagCode_code_idx" ON "TagCode"("code");

-- CreateIndex
CREATE INDEX "TagCode_userId_idx" ON "TagCode"("userId");

-- CreateIndex
CREATE INDEX "GameEvent_gameId_idx" ON "GameEvent"("gameId");

-- CreateIndex
CREATE INDEX "GameItem_gameId_idx" ON "GameItem"("gameId");

-- CreateIndex
CREATE INDEX "GameCheckout_gameId_idx" ON "GameCheckout"("gameId");

-- CreateIndex
CREATE INDEX "GameCheckout_userId_idx" ON "GameCheckout"("userId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_defaultRoleId_fkey" FOREIGN KEY ("defaultRoleId") REFERENCES "GameRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAward" ADD CONSTRAINT "GameAward_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAwardee" ADD CONSTRAINT "GameAwardee_awardId_fkey" FOREIGN KEY ("awardId") REFERENCES "GameAward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAwardee" ADD CONSTRAINT "GameAwardee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRole" ADD CONSTRAINT "GameRole_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMembership" ADD CONSTRAINT "GameMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMembership" ADD CONSTRAINT "GameMembership_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMembership" ADD CONSTRAINT "GameMembership_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "GameRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMembership" ADD CONSTRAINT "GameMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMembership" ADD CONSTRAINT "GameMembership_fakeTeamId_fkey" FOREIGN KEY ("fakeTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePost" ADD CONSTRAINT "GamePost_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagCode" ADD CONSTRAINT "TagCode_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagCode" ADD CONSTRAINT "TagCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameItem" ADD CONSTRAINT "GameItem_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCheckout" ADD CONSTRAINT "GameCheckout_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCheckout" ADD CONSTRAINT "GameCheckout_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "GameItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCheckout" ADD CONSTRAINT "GameCheckout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
