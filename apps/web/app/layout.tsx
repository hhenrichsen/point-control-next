import "@pointcontrol/ui/global.css";
import { Provider as JotaiProvider } from "jotai";
import { ClientHeader } from "./clientheader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <JotaiProvider>
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
            <ClientHeader />
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
    </JotaiProvider>
  );
}
