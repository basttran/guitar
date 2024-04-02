import { Option, O } from "../option/option";
export const A = {
  map:
    <T, S>(fn: (item: T) => S) =>
    (d: T[]) =>
      d.map(fn),
  reduce:
    <T, S>(init: S, fn: (acc: S, value: T) => S) =>
    (array: Array<T>) =>
      array.reduce(fn, init),
  findFirst:
    <T>(predicate: (value: T) => boolean) =>
    (array: Array<T>): Option<T> => {
      const foundelement = array.find((element) => predicate(element));
      if (!foundelement) {
        return {
          _tag: "None",
        };
      }
      return O.some(foundelement);
    },
  compact: <T>(array: Array<Option<T>>): Array<T> => {
    return array.filter(O.isSome).map((o) => o.value);
    // throw new Error("Not implemented");
  },
};
