import Link from "next/link";
import { Button } from "@pointcontrol/ui/components/button";

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="my-10 flex flex-col items-center justify-center">
        <h1 className="text-slate-900" style={{ fontSize: "96px" }}>
          hvz.gg
        </h1>
        <p>Your source for infection tag tracking!</p>
      </div>
      <div className="my-10 flex flex-row items-center justify-center">
        <Link className="text-blue-500" href="/games/">
          <Button>Game List (NYI)</Button>
        </Link>
      </div>

      <div className="my-10 flex flex-row items-center justify-center">
        <p>
          If you are seeing this page, join us on{" "}
          <a className="text-blue-500" href="https://discord.gg/SYurS4m2aR">
            Discord
          </a>
        </p>
      </div>
    </div>
  );
}
