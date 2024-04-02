import { O, none } from "./option";
import { pipe } from "../pipe/pipe";
import { describe, it, expect } from "vitest";

describe("Option", () => {
  it("is some?", () => {
    const firstOption = O.some(36);
    const secondOption = none;

    expect(O.isSome(firstOption)).toBe(true);
    expect(O.isSome(secondOption)).toBe(false);
  });

  it("get some", () => {
    const value = pipe(
      O.some(36),
      O.getOrElse(() => 0)
    );
    expect(value).toEqual(36);
  });
  it("or else", () => {
    const value = pipe(
      none,
      O.getOrElse(() => 0)
    );
    expect(value).toEqual(0);
  });

  it("option from nullable", () => {
    const firstValue = pipe(
      O.fromNullable(123),
      O.getOrElse(() => 0)
    );
    const secondValue = pipe(
      O.fromNullable(undefined),
      O.getOrElse(() => 0)
    );
    expect(firstValue).toEqual(123);
    expect(secondValue).toEqual(0);
  });

  it("option from predicate", () => {
    const isEven = (x: number) => x % 2 === 0;
    const fn = (x: number) =>
      pipe(
        x,
        O.fromPredicate(isEven),
        O.getOrElse(() => x - 1)
      );
    expect(fn(124)).toBe(124);
    expect(fn(125)).toBe(124);
  });

  it("pattern matching", () => {
    const isEven = (x: number) => x % 2 === 0;
    const fn = (x: number) =>
      pipe(
        x,
        O.fromPredicate(isEven),
        O.match(
          () => "Not an even value",
          (value) => `Even value = ${value}`
        )
      );

    expect(fn(42)).toEqual("Even value = 42");
    expect(fn(43)).toEqual("Not an even value");
  });

  it("map", () => {
    const isEven = (x: number) => x % 2 === 0;
    const fn = (x: number) =>
      pipe(
        x,
        O.fromPredicate(isEven),
        O.map((x) => `_${x}_`),
        O.match(
          () => "Not an even value",
          (value) => `Even value = ${value}`
        )
      );

    expect(fn(42)).toEqual("Even value = _42_");
    expect(fn(43)).toEqual("Not an even value");
  });
  it("filter", () => {
    const isPositive = (x: number) => x >= 0;
    const isNotZero = (x: number) => x !== 0;
    const fn = (x: number) =>
      pipe(
        O.some(x),
        O.filter(isNotZero),
        O.map((x) => 1 - 1 / x),
        O.filter(isPositive),
        O.map(Math.sqrt),
        O.getOrElse(() => 0)
      );

    expect(fn(0.1)).toEqual(0);
    expect(fn(-0.1)).not.toEqual(0);
  });

  it("filter and map at once", () => {
    const isPositive = (x: number) => x > 0;

    const cutIntoEqualParts = (pieSize: number, parts: number) =>
      pipe(
        O.some(parts),
        O.filter(isPositive),
        O.filterMap((x) => (x === 0 ? none : O.some(pieSize / x))),
        O.getOrElse(() => 0)
      );

    expect(cutIntoEqualParts(10, 4)).toBe(2.5);
  });
});
