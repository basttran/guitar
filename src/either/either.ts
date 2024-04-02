export type Left<E> = {
  readonly _tag: "Left";
  readonly left: E;
};

export type Right<A> = {
  readonly _tag: "Right";
  readonly right: A;
};

export type Either<E, A> = Left<E> | Right<A>;

export const E = {
  left: <T>(value: T): Left<T> => ({ _tag: "Left", left: value }),
  right: <T>(value: T): Right<T> => ({ _tag: "Right", right: value }),
  isLeft: <E, A>(e: Either<E, A>): e is Left<E> => e._tag === "Left",
  isRight: <E, A>(e: Either<E, A>): e is Right<A> => e._tag === "Right",
  getOrElse:
    <E, A>(fn: (u?: E) => A) =>
    (e: Either<E, A>): A =>
      E.isRight(e) ? e.right : fn(e.left),
  fromNullable:
    <E>(e: E) =>
    <T>(value: T): Either<E, NonNullable<T>> => {
      if (value === null || value === undefined) {
        return E.left(e);
      }
      return E.right(value);
    },
  fromPredicate:
    <E, T>(predicate: (value: T) => boolean, onFalse: () => E) =>
    (value: T): Either<E, T> => {
      if (predicate(value)) {
        return E.right(value);
      } else {
        return E.left(onFalse());
      }
    },
  filterOrElse:
    <E, T>(predicate: (value: T) => boolean, onFalse: (e?: any) => E) =>
    (e: Either<E, T>): Either<E, T> => {
      if (E.isRight(e)) {
        if (predicate(e.right)) {
          return e;
        } else {
          return E.left(onFalse(e));
        }
      }
      return e;
    },
  map:
    <A, B>(fn: (value: A) => B) =>
    <E>(either: Either<E, A>): Either<E, B> => {
      if (E.isRight(either)) {
        return E.right(fn(either.right));
      }
      return either;
    },
  match:
    <E, A, B>(onLeft: (e: E) => B, onRight: (value: A) => B) =>
    (e: Either<E, A>) => {
      if (E.isRight(e)) {
        return onRight(e.right);
      } else {
        return onLeft(e.left);
      }
    },
  mapLeft:
    <A, B>(fn: (value: A) => B) =>
    <T>(either: Either<A, T>): Either<B, T> => {
      if (E.isLeft(either)) {
        return E.left(fn(either.left));
      }
      return either;
    },
};
