import { pipe } from "./pipe";
import { describe, it, expect } from "vitest";

describe("Pipe", () => {
  it("pipe helps compose functions", () => {
    const value = pipe(
      "No",
      (s) => s + " stairway!",
      (s) => s.toUpperCase()
    );
    expect(value).toEqual("NO STAIRWAY!");
  });
});
