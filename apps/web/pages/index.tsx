import Link from "next/link";

export default function Home(): JSX.Element {
  return (
    <>
      <h1 className="text-slate-900">PointControl</h1>
      <Link className="text-blue-500" href="/games/">
        Game List
      </Link>

      <p>
        If you are seeing this page, join us on{" "}
        <a className="text-blue-500" href="https://discord.gg/SYurS4m2aR">
          Discord
        </a>
      </p>
    </>
  );
}
