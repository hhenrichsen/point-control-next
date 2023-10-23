import { describe, expect, it } from "vitest";
import { withAnonContext, withAuthContext } from "./context.test";
import { appRouter } from "./index";

describe(module.id, () => {
  describe("createGame", () => {
    it("should create a game when authenticated", async () => {
      return withAuthContext(async ({ ctx }) => {
        const caller = appRouter.createCaller(ctx);

        const { slug } = await caller.createGame({
          title: "Test Game",
          description: "This is a test game.",
          location: "Test Location",
          public: true,
          approval: true,
        });

        expect(slug).toBeDefined();

        // Clean up afterwards
        await ctx.prisma.game.delete({
          where: {
            slug,
          },
        });
      });
    });

    it("should not create a game when unauthenticated", async () => {
      return withAnonContext(async ({ ctx }) => {
        const caller = appRouter.createCaller(ctx);

        const promise = caller.createGame({
          title: "Test Game",
          description: "This is a test game.",
          location: "Test Location",
          public: true,
          approval: true,
        });
        await expect(promise).rejects.toThrowError();
      });
    });
  });
});
