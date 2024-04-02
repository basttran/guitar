import { E } from "./either";
import { pipe } from "../pipe/pipe";
import { describe, it, expect } from "vitest";

describe("Either", () => {
  it("is right or left?", () => {
    const right = E.right(36);
    const left = E.left("fail");

    expect(right).toEqual(
      expect.objectContaining({ _tag: "Right", right: 36 })
    );

    expect(E.isRight(left)).toBe(false);
  });
  it("get right", () => {
    const value = pipe(
      E.right(36),
      E.getOrElse(() => 0)
    );

    expect(value).toEqual(36);
  });
  it("get something else if left", () => {
    const value = pipe(
      E.left(999),
      E.getOrElse(() => 0)
    );
    expect(value).toEqual(0);
  });

  it("build either from nullable", () => {
    const firstValue = pipe(
      123,
      E.fromNullable(999),
      E.getOrElse(() => 0)
    );
    const secondValue = pipe(
      undefined,
      E.fromNullable(999),
      E.getOrElse(() => 0)
    );
    const thirdValue = pipe(
      undefined,
      E.fromNullable(999),
      E.match(
        (e) => e,
        (a) => a
      )
    );
    expect(firstValue).toEqual(123);
    expect(secondValue).toEqual(0);
    expect(thirdValue).toEqual(999);
  });

  it("either from predicate", () => {
    const isEven = (x: number) => x % 2 === 0;
    const fn = (x: number) =>
      pipe(
        x,
        E.fromPredicate(isEven, () => 999),
        E.getOrElse((e) => (e ? e - 1 : 777))
      );
    expect(fn(124)).toBe(124);
    expect(fn(125)).toBe(998);
  });

  it("pattern matching", () => {
    const isEven = (x: number) => x % 2 === 0;
    const fn = (x: number) =>
      pipe(
        x,
        E.fromPredicate(isEven, () => 999),
        E.match(
          (e) => `${e} is not an even value`,
          (value) => `Even value = ${value}`
        )
      );

    expect(fn(42)).toEqual("Even value = 42");
    expect(fn(43)).toEqual("999 is not an even value");
  });

  it("map", () => {
    const isEven = (x: number) => x % 2 === 0;
    const fn = (x: number) =>
      pipe(
        x,
        E.fromPredicate(isEven, () => 999),
        E.map((x) => `_${x}_`),
        E.match(
          () => "Not an even value",
          (value) => `Even value = ${value}`
        )
      );

    expect(fn(42)).toEqual("Even value = _42_");
    expect(fn(43)).toEqual("Not an even value");
  });
  it("filter and map at once", () => {
    const isPositive = (x: number) => x > 0;

    const cutIntoEqualParts = (pieSize: number, parts: number) =>
      pipe(
        E.right(parts),
        E.filterOrElse(isPositive, () => -999),
        E.map((x) => pieSize / x),
        E.getOrElse((e) => e || 0)
      );

    expect(cutIntoEqualParts(10, 4)).toBe(2.5);
    expect(cutIntoEqualParts(10, -4)).toBe(-999);
  });
});
