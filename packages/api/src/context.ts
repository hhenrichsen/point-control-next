import { prisma } from "@pointcontrol/db/lib/prisma";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { auth } from "@pointcontrol/auth";

export async function createContext(opts: CreateNextContextOptions): Promise<{
  prisma: typeof prisma;
  session: inferAsyncReturnType<typeof auth> | null;
}> {
  const session = await auth(opts.req, opts.res);
  return { prisma, session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
