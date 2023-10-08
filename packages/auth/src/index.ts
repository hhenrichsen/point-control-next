import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import type { OAuthConfig } from "next-auth/providers";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@pointcontrol/db/lib/prisma";

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, NEXTAUTH_SECRET } =
  process.env;

if (!NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set and is required");
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DISCORD_CLIENT_ID &&
      DISCORD_CLIENT_SECRET &&
      DiscordProvider({
        clientId: DISCORD_CLIENT_ID,
        clientSecret: DISCORD_CLIENT_SECRET,
      }),
  ].filter(
    (
      item: OAuthConfig<unknown> | undefined | "",
    ): item is OAuthConfig<unknown> => Boolean(item),
  ),
  secret: NEXTAUTH_SECRET,
} satisfies NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
): ReturnType<typeof getServerSession> {
  return getServerSession(...args, authOptions);
}
