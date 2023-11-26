"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@pointcontrol/ui";
import type { PublicGame } from "@pointcontrol/types";
import { trpcClient } from "../../util/trpc";

export default function GameList(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<PublicGame[]>([]);

  useEffect(() => {
    async function fetchGames(): Promise<void> {
      if (!games.length && loading) {
        const publicGames = await trpcClient.publicGames.query();
        setGames(publicGames);
        setLoading(false);
      }
    }
    fetchGames().catch(() => {
      setGames([]);
    });
  }, [games.length, loading]);

  return (
    <>
      <h1 className="mb-8 text-2xl">Game List</h1>
      {loading ? (
        <div className="items-begin flex w-full max-w-prose flex-col rounded-md bg-slate-50 p-8 dark:bg-slate-900">
          <Skeleton className="h-[28px] w-full rounded-full" />
          <Skeleton className="h-[20px] w-[80px] rounded-full bg-slate-500" />
          <Skeleton className="h-[24px] max-w-[200px] rounded-full" />
        </div>
      ) : null}
      {games.map((game) => (
        <Link
          className="flex w-full max-w-prose flex-col rounded-md bg-slate-50 p-8 dark:bg-slate-900"
          href={`/games/${game.slug}`}
          key={game.id}
        >
          <div className="">
            <div className="text-lg font-bold">{game.name}</div>
            <div className="text-sm italic text-slate-500">{game.location}</div>
            <div>{game.description}</div>
          </div>
        </Link>
      ))}
    </>
  );
}
