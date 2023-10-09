import type { DefaultSession as _OrigDefaultSession } from "next-auth";

declare module "next-auth" {
  interface DefaultSession {
    user: {
      id: string;
    } & _OrigDefaultSession["user"];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
    } & _OrigDefaultSession["user"];
  }
}
