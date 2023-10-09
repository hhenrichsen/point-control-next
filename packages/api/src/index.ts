import { TRPCError } from "@trpc/server";
import * as z from "zod";
import slug from "slug";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  createGame: publicProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string().min(3).max(64).optional(),
        description: z.string(),
        location: z.string(),
        public: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      if (!session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a game.",
        });
      }

      const gameSlug: string = input.slug ?? slug(input.title);
      if (gameSlug.length < 3 || gameSlug.length > 64) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug must be between 3 and 64 characters.",
        });
      }

      const game = await prisma.game.create({
        data: {
          ownerId: session.user.id,
          name: input.title,
          slug: gameSlug,
          description: input.description,
          location: input.location,
          public: input.public ?? false,
        },
      });

      return game;

      // TODO: Add some default roles and stuff.
    }),
});

export type AppRouter = typeof appRouter;
