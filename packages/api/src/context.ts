import { prisma } from "@pointcontrol/db/lib/prisma";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export function createContext(_opts: CreateNextContextOptions): {
  prisma: typeof prisma;
} {
  return { prisma };
}

export type Context = inferAsyncReturnType<typeof createContext>;
