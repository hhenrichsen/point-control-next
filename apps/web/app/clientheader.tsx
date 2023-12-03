"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { DarkToggle } from "@pointcontrol/ui";
import { useAtom } from "jotai";
import { UserCircle2 } from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { currentSubpage } from "./currentsubpage";

export function ClientHeader(): JSX.Element {
  const auth = useAuth();
  const subpage = useAtom(currentSubpage)[0];

  const authButton = auth.userId ? (
    <UserButton afterSignOutUrl="/" />
  ) : (
    <Link
      className="text-bold flex flex-row items-center justify-center"
      href="/auth/login"
      style={{ width: 32, height: 32 }}
    >
      <UserCircle2 />
    </Link>
  );
  return (
    <header className="sticky top-0 flex items-center justify-between bg-slate-50 text-slate-950 shadow-md dark:bg-slate-950 dark:text-slate-50">
      <div className="flex flex-row items-end justify-center gap-2 p-4">
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 className="m-0 text-xl font-bold text-slate-950 dark:text-slate-50">
            hvz.gg
          </h1>
        </Link>
        {subpage ? (
          <span className="invisible flex flex-row items-end gap-2 sm:visible">
            <span className="text-xl text-slate-600 dark:text-slate-400">
              /
            </span>
            <Link href={subpage.href}>
              <h2 className="text-l font-bold text-slate-950 dark:text-slate-50">
                {subpage.title}
              </h2>
            </Link>
          </span>
        ) : null}
      </div>
      <div className="flex flex-row items-center justify-center">
        <ThemeProvider attribute="class">
          <DarkToggle />
        </ThemeProvider>
        <div className="p-4 pr-6" style={{ height: 64, width: 72 }}>
          {authButton}
        </div>
      </div>
    </header>
  );
}
