import { prisma } from "@pointcontrol/db/lib/prisma";
import { notFound } from "next/navigation";
import { GameDetailClientComponent } from "./client";

export default async function GameHome({
  params,
}: {
  params: { gameSlug: string };
}): Promise<JSX.Element> {
  const game = await prisma.game.findUnique({
    where: {
      slug: params.gameSlug,
    },
  });

  if (!game) {
    return notFound();
  }

  return <GameDetailClientComponent game={game} />;
}
