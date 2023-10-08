import { fileURLToPath } from "url";

/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  plugins: ["prettier-plugin-prisma", "prettier-plugin-tailwindcss"],
  tailwindConfig: fileURLToPath(
    new URL("../tailwind-config/index.ts", import.meta.url),
  ),
};

export default config;
