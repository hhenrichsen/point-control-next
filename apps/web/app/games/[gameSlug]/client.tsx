"use client";

import type { PublicGame } from "@pointcontrol/types";
import { useAtom } from "jotai";
import { currentSubpage } from "../../currentsubpage";

export function GameDetailClientComponent({
  game,
}: {
  game: PublicGame;
}): JSX.Element {
  const [subpage, setSubpage] = useAtom(currentSubpage);

  if (subpage?.title !== game.name) {
    setSubpage({ title: game.name, href: `/games/${game.slug}` });
  }

  return (
    <>
      <h1 className="text-4xl font-bold">{game.name}</h1>
      <p className="text-xl">{game.description}</p>
    </>
  );
}
