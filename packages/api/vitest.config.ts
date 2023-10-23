import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export -- sir this is a config file
export default defineConfig({
  plugins: [],
  test: {
    environment: "node",
    exclude: ["**/node_modules/**", "**/*.test.ts"],
  },
});
