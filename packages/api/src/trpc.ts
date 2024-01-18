import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(() => {
  throw new TRPCError({
    code: "UNAUTHORIZED",
  });
});

export const authedProcedure = t.procedure.use(isAuthed);
