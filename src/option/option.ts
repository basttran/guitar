export type Some<T> = {
  readonly _tag: "Some";
  value: T;
};
export type None = {
  readonly _tag: "None";
};
export const none: None = {
  _tag: "None",
};
export type Option<T> = Some<T> | None;

export const O = {
  some: <T>(value: T): Some<T> => ({
    _tag: "Some",
    value,
  }),
  isSome: <T>(o: Option<T>): o is Some<T> => o._tag === "Some",
  fromNullable: <T>(value: T): Option<NonNullable<T>> => {
    if (value === null || value === undefined) {
      return {
        _tag: "None",
      };
    }
    return O.some(value);
  },
  map:
    <T, S>(fn: (value: T) => S) =>
    (o: Option<T>): Option<S> => {
      if (O.isSome(o)) {
        return O.some(fn(o.value));
      } else {
        return { _tag: "None" };
      }
    },
  filter:
    <T>(predicate: (value: T) => boolean) =>
    (o: Option<T>): Option<T> => {
      if (O.isSome(o) && predicate(o.value)) {
        return o;
      }
      return none;
    },
  match:
    <T, S>(onNone: () => S, onSome: (value: T) => S) =>
    (o: Option<T>): S => {
      if (O.isSome(o)) {
        return onSome(o.value);
      } else {
        return onNone();
      }
    },
  fromPredicate:
    <T>(predicate: (value: T) => boolean) =>
    (value: T): Option<T> => {
      if (predicate(value)) {
        return O.some(value);
      } else {
        return { _tag: "None" };
      }
    },
  getOrElse:
    <T>(fn: () => T) =>
    (o: Option<T>): T => {
      return O.isSome(o) ? o.value : fn();
    },
  filterMap:
    <T, S>(fn: (value: T) => Option<S>) =>
    (o: Option<T>): Option<S> => {
      return O.isSome(o) ? fn(o.value) : none;
    },
};
