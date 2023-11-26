import {
  type CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@pointcontrol/api/src/index";
import superjson from "superjson";

function getBaseUrl(): string {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const links = [
  httpBatchLink({
    /**
     * If you want to use SSR, you need to use the server's full URL
     * {@link https://trpc.io/docs/ssr}
     **/
    url: `${getBaseUrl()}/api/trpc`,
  }),
];

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return { links, transformer: superjson };
  },
  /**
   * {@link https://trpc.io/docs/ssr}
   **/
  ssr: false,
});

export const trpcClient: CreateTRPCProxyClient<AppRouter> =
  createTRPCProxyClient<AppRouter>({
    links,
    transformer: superjson,
  });
