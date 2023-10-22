import { TRPCError } from "@trpc/server";
import slug from "slug";
import { createGameSchema } from "@pointcontrol/types";
import { authedProcedure, router } from "./trpc";

export const appRouter = router({
  createGame: authedProcedure
    .input(createGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { auth, prisma } = ctx;

      const gameSlug: string = slug(input.title);
      if (gameSlug.length < 3 || gameSlug.length > 64) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug must be between 3 and 64 characters.",
        });
      }

      const game = await prisma.game.create({
        data: {
          ownerId: auth.userId,
          name: input.title,
          slug: gameSlug,
          description: input.description,
          location: input.location,
          public: input.public ?? false,
          approval: input.approval ?? false,
        },
        select: {
          slug: true,
        },
      });

      return game;

      // TODO: Add some default roles and stuff.
    }),
});

export type AppRouter = typeof appRouter;
