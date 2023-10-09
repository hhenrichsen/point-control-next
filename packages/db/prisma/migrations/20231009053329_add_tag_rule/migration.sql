-- CreateEnum
CREATE TYPE "TagRuleType" AS ENUM ('ADD_POINTS', 'SET_TEAM', 'SET_TAGGER_TEAM', 'EXCHANGE_TEAM', 'DISALLOW');

-- CreateTable
CREATE TABLE "TagRule" (
    "id" SERIAL NOT NULL,
    "gameId" VARCHAR(32) NOT NULL,
    "teamId" VARCHAR(32),
    "type" "TagRuleType" NOT NULL,
    "value" INTEGER,
    "teamValueId" VARCHAR(32),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TagRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TagRule" ADD CONSTRAINT "TagRule_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRule" ADD CONSTRAINT "TagRule_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRule" ADD CONSTRAINT "TagRule_teamValueId_fkey" FOREIGN KEY ("teamValueId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
