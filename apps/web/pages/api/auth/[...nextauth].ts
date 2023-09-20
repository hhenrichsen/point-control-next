import NextAuth from "next-auth"
import type { OAuthConfig } from "next-auth/providers";
import DiscordProvider from "next-auth/providers/discord";

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, NEXTAUTH_SECRET } = process.env;

if (!NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not set and is required");
}

export const authOptions = {
    providers: [
        DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET && DiscordProvider({
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET,
        }),
    ].filter((item: OAuthConfig<unknown> | undefined): item is OAuthConfig<unknown> => Boolean(item)),
    secret: NEXTAUTH_SECRET,
}
export default NextAuth(authOptions)