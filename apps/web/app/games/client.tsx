"use client";

import { useAtom } from "jotai";
import { currentSubpage } from "../currentsubpage";

export function GameIndexClientComponent(): JSX.Element {
  const [subpage, setSubpage] = useAtom(currentSubpage);

  if (subpage?.title !== "Games") {
    setSubpage({ title: "Games", href: "/games" });
  }

  return <span />;
}
