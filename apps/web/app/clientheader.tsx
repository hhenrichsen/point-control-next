"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { DarkToggle } from "@pointcontrol/ui";
import { UserCircle2 } from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";

export function ClientHeader(): JSX.Element {
  const auth = useAuth();

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
    <div className="flex flex-row items-center justify-center">
      <ThemeProvider attribute="class">
        <DarkToggle />
      </ThemeProvider>
      <div className="p-4 pr-6" style={{ height: 64, width: 72 }}>
        {authButton}
      </div>
    </div>
  );
}
