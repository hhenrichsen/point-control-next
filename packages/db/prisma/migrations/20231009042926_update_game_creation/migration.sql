-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_defaultRoleId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "defaultRoleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lifetimeTags" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_defaultRoleId_fkey" FOREIGN KEY ("defaultRoleId") REFERENCES "GameRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
