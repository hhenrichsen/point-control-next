import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../pages/index";

test("Should have a heading", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { level: 1, name: "hvz.gg" }),
  ).toBeDefined();
});
