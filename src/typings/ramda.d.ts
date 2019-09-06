import { F } from "ts-toolbelt";

declare module "ramda" {
  interface Static {
    pipe<T extends F.Function[]>(...args: F.Piper<T>): F.Pipe<T>;
    allPass<T extends F.Function<U, boolean>, U extends any[]>(
      preds: readonly T[]
    ): T;
    ifElse<T, U, V extends any[]>(
      preds: (...args: V) => boolean,
      onTrue: (...args: V) => T,
      onFalse: (...args: V) => U
    ): (...args: V) => T | U;

    ifElse<X, Y, T, U>(
      preds: (arg: X | Y) => arg is X,
      onTrue: (arg: X) => T,
      onFalse: (arg: Y) => U
    ): (arg: X | Y) => T | U;

    head<T>(list: ReadonlyArray<T>): T | undefined;

    converge<T extends any[], F extends (...args: any[]) => any>(
      after: F,
      fns: [(...args: T) => F.Parameters<F>[0]]
    ): (...args: T) => ReturnType<F>;
    converge<T extends any[], F extends (...args: any[]) => any>(
      after: F,
      fns: [
        (...args: T) => F.Parameters<F>[0],
        (...args: T) => F.Parameters<F>[1]
      ]
    ): (...args: T) => ReturnType<F>;
    converge<T extends any[], F extends (...args: any[]) => any>(
      after: F,
      fns: [
        (...args: T) => F.Parameters<F>[0],
        (...args: T) => F.Parameters<F>[1],
        (...args: T) => F.Parameters<F>[2]
      ]
    ): (...args: T) => ReturnType<F>;
    converge<T extends any[], F extends (...args: any[]) => any>(
      after: F,
      fns: [
        (...args: T) => F.Parameters<F>[0],
        (...args: T) => F.Parameters<F>[1],
        (...args: T) => F.Parameters<F>[2],
        (...args: T) => F.Parameters<F>[3]
      ]
    ): (...args: T) => ReturnType<F>;

    identity<T>(a: F.NoInfer<T>): T;
    prop<T, U extends keyof T>(key: U): (obj: T) => T[U];

    useWith<T1>(fn: () => T1): () => T1;
    useWith<T1, I1, O1>(
      fn: (arg0: O1) => T1,
      transformers: readonly [(arg: I1) => O1]
    ): F.Curry<(arg0: I1) => T1>;
    useWith<T1, I1, O1, I2, O2>(
      fn: (arg0: O1, arg1: O2) => T1,
      transformers: readonly [(arg: I1) => O1, (arg: I2) => O2]
    ): F.Curry<(arg0: I1, arg1: I2) => T1>;
    useWith<T1, I1, O1, I2, O2, I3, O3>(
      fn: (arg0: O1, arg1: O2, arg2: O3) => T1,
      transformers: readonly [(arg: I1) => O1, (arg: I2) => O2, (arg: I3) => O3]
    ): F.Curry<(arg0: I1, arg1: I2, arg2: I3) => T1>;
    useWith<T1, I1, O1, I2, O2, I3, O3, I4, O4>(
      fn: (arg0: O1, arg1: O2, arg2: O3, arg3: O4) => T1,
      transformers: readonly [
        (arg: I1) => O1,
        (arg: I2) => O2,
        (arg: I3) => O3,
        (arg: I4) => O4
      ]
    ): F.Curry<(arg0: I1, arg1: I2, arg2: I3, arg3: I4) => T1>;

    binary<T extends F.Function>(
      fn: T
    ): (arg1: F.Parameters<T>[0], arg2: F.Parameters<T>[1]) => F.Return<T>;
    path(idx: string[]): (obj: any) => any | undefined;
  }
}
