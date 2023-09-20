import Link from "next/link";

export default function Home(): JSX.Element {
  return (
    <>
      <h1>PointControl</h1>
      <Link href="/games/">Game List</Link>
    </>
  );
}
