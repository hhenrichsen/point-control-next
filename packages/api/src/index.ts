import { TRPCError } from "@trpc/server";
import slug from "slug";
import { type PublicGame, createGameSchema } from "@pointcontrol/types";
import * as z from "zod";
import { GamePermission } from "@pointcontrol/db/lib/generated/client";
import { authedProcedure, publicProcedure, router } from "./trpc";

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
      const { auth, prisma } = ctx;
      if (auth?.userId) {
        return prisma.game.findMany({
          where: {
            OR: [
              {
                public: true,
              },
              {
                ownerId: auth.userId,
              },
            ],
          },
          skip: (input?.page ?? 0) * 10,
          take: 10,
          orderBy: {
            updated: "desc",
          },
          select: PublicGameFields,
        });
      }
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
        select: PublicGameFields,
      });

      await prisma.gameRole.create({
        data: {
          gameId: game.slug,
          name: "Admin",
          color: "ff0000",
          position: 0,
          permissions: [GamePermission.ADMIN],
        },
      });

      await prisma.gameRole.create({
        data: {
          gameId: game.slug,
          name: "Moderator",
          color: "#fab000",
          position: 0,
          permissions: [
            GamePermission.VIEW,
            GamePermission.PLAY,
            GamePermission.EDIT,
          ],
        },
      });

      const userRole = await prisma.gameRole.create({
        data: {
          gameId: game.slug,
          name: "User",
          color: "ffffff",
          position: 0,
          permissions: [GamePermission.VIEW, GamePermission.PLAY],
        },
      });

      await prisma.game.update({
        where: {
          id: game.id,
        },
        data: {
          defaultRoleId: userRole.id,
        },
      });

      return game;

      // TODO: Add some default roles and stuff.
    }),
});

export type AppRouter = typeof appRouter;
