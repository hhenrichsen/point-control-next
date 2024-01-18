import { type PublicGame } from "@pointcontrol/types";
import * as z from "zod";
import { publicProcedure, router } from "./trpc";

const PublicGameFields = {
  id: true,
  slug: true,
  name: true,
  description: true,
  location: true,
  created: true,
  updated: true,
};

export const appRouter = router({
  publicGames: publicProcedure
    .input(z.object({ page: z.number() }).optional())
    .query(async ({ ctx, input }): Promise<PublicGame[]> => {
      const { prisma } = ctx;
      return prisma.game.findMany({
        where: {
          public: true,
        },
        skip: (input?.page ?? 0) * 10,
        take: 10,
        orderBy: {
          updated: "desc",
        },
        select: PublicGameFields,
      });
    }),
});

export type AppRouter = typeof appRouter;
