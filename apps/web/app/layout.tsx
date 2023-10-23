import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import "@pointcontrol/ui/global.css";
import { ClientHeader } from "./clientheader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
    >
      <html
        className="min-h-screen"
        lang="en"
        style={{ height: "100%", overflowY: "hidden" }}
        suppressHydrationWarning
      >
        <body
          className="m-0 flex flex-col bg-slate-200 dark:bg-slate-800"
          style={{ height: "100%", overflowY: "hidden" }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>
            <header className="sticky top-0 flex items-center justify-between bg-slate-50 text-slate-950 shadow-md dark:bg-slate-950 dark:text-slate-50">
              <Link href="/" style={{ textDecoration: "none" }}>
                <h1 className="m-0 p-4 text-xl font-bold text-slate-950 dark:text-slate-50">
                  hvz.gg
                </h1>
              </Link>
              <ClientHeader />
            </header>
            <main
              // Screen height - header height - footer height
              className="flex flex-col items-center justify-center"
              style={{ minHeight: "calc(100vh - 64px - 56px)" }}
            >
              {children}
            </main>
            <footer className="bottom-0 flex min-w-full justify-center bg-slate-300 p-4 shadow-md dark:bg-slate-700">
              <p className="text-slate-800 dark:text-slate-200">
                Copyright &copy; Hunter Henrichsen, {new Date().getFullYear()}
              </p>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
