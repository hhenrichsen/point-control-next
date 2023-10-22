import { prisma } from "@pointcontrol/db/lib/prisma";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { SignedInAuthObject, SignedOutAuthObject } from "@clerk/backend";
import { getAuth } from "@clerk/nextjs/server";

export function createContext(_opts: CreateNextContextOptions): {
  prisma: typeof prisma;
  auth: SignedInAuthObject | SignedOutAuthObject | null;
} {
  const auth = getAuth(_opts.req);
  return { prisma, auth };
}

export type Context = inferAsyncReturnType<typeof createContext>;
