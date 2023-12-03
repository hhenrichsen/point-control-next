import Link from "next/link";
import { Button } from "@pointcontrol/ui/components/button";
import { RootClientComponent } from "./client";

export default function Home(): JSX.Element {
  return (
    <div className="">
      <div className="my-10 flex flex-col items-center justify-center">
        <h1
          className="text-slate-950 dark:text-slate-50"
          style={{ fontSize: "96px" }}
        >
          hvz.gg
        </h1>
        <p className="text-slate-800 dark:text-slate-200">
          Your source for infection tag tracking!
        </p>
      </div>
      <div className="my-24 flex flex-row items-center justify-center">
        <Link className="text-blue-500" href="/games/">
          <Button>Game List (NYI)</Button>
        </Link>
      </div>

      <div className="my-10 flex flex-row items-center justify-center">
        <p className="text-slate-800 dark:text-slate-200">
          If you are seeing this page, join us on{" "}
          <a className="text-orange-500" href="https://discord.gg/SYurS4m2aR">
            Discord
          </a>
        </p>
      </div>
      <RootClientComponent />
    </div>
  );
}
