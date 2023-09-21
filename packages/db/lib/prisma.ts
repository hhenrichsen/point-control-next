// eslint-disable-next-line -- need to import the generated code
import { PrismaClient } from "@db/lib/generated/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma: { prisma?: PrismaClient } = global as unknown as {
  prisma: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// eslint-disable-next-line import/no-default-export -- need to get dev mode working correctly
export default prisma;
