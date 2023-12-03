"use client";

import { useAtom } from "jotai";
import { currentSubpage } from "./currentsubpage";

export function RootClientComponent(): JSX.Element {
  const [subpage, setSubpage] = useAtom(currentSubpage);

  if (subpage) {
    setSubpage(undefined);
  }

  return <span />;
}
