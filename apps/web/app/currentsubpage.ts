import { atom } from "jotai";

export const currentSubpage = atom<{ href: string; title: string } | undefined>(
  undefined,
);
