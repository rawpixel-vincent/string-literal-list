import { sl } from './types.js';

export type ArrayInPlaceMutation = {
  push: 'push';
  unshift: 'unshift';
  shift: 'shift';
  copyWithin: 'copyWithin';
  pop: 'pop';
  fill: 'fill';
  splice: 'splice';
};

export const ARRAY_IN_PLACE_MUTATION: ArrayInPlaceMutation;


interface ILiterals<T extends string> {
  literal: T;
}

export type MaybeReadonly<T extends boolean, A> = [T] extends [true] ? Readonly<A> : A;

export interface IStringList<T extends string, Mut extends boolean = false>
  extends Omit<
    Array<T>,
    sl.specs.ImplementedMethod
  >, ILiterals<T> {

  // Custom Methods
  withPrefix<P extends string>(
    prefix: P,
  ): MaybeReadonly<Mut, IStringList<sl.utils.StringConcat<P, T extends string ? T : string>, Mut>>;
  withSuffix<P extends string>(
    suffix: P,
  ): MaybeReadonly<Mut, IStringList<sl.utils.StringConcat<T extends string ? T : string, P>, Mut>>;

  withDerivatedSuffix<S extends string>(
    chars: S
  ): MaybeReadonly<Mut, IStringList<
    | T
    | sl.utils.DropSuffix<
      sl.utils.DropSuffix<
        `${T}${S}${S}`,
        S
      >,
      `${S}${S}`
    >,
    Mut>>;

  withDerivatedPrefix<S extends string>(
    chars: S
  ): MaybeReadonly<Mut, IStringList<
    T |
    sl.utils.DropPrefix<
      sl.utils.DropPrefix<
        `${S}${S}${T}`,
        S
      >,
      `${S}${S}`
    >,
    Mut>>;

  withReplace<S extends string | RegExp, D extends string>(
    searchValue: S,
    replaceValue: D
  ): MaybeReadonly<Mut, IStringList<sl.utils.Replace<T, S, D>, Mut>>;

  withReplaceAll<S extends string | RegExp, D extends string>(
    searchValue: S,
    replaceValue: D
  ): MaybeReadonly<Mut, IStringList<sl.utils.ReplaceAll<T, S, D>, Mut>>;

  withTrim(): MaybeReadonly<Mut, IStringList<sl.utils.Trim<T>, Mut>>;
  value(val): T;
  mutable(): T & string[];
  sort<P1 = T, P2 = T>(compareFn?: (a: P1, b: P2) => number): this;
  reverse(): this;
  without<PP extends T & string, S extends string>(...arg: (ILiterals<S> | S)[]): MaybeReadonly<Mut, IStringList<Exclude<PP | S, S>, Mut>>;

  // Implemented methods to return the frozen array, typed as IStringList.
  toSorted(compareFn?: (a: T, b: T) => number): MaybeReadonly<Mut, IStringList<T, Mut>>;
  toReversed(): IStringList<T, Mut>;

  concat<PP extends T, S extends string>(...arg: (ILiterals<S> | S)[]): MaybeReadonly<Mut, IStringList<PP | S, Mut>>;
  // Readonly overrides
  readonly length: number;
  readonly [n: number]: T | undefined;
  readonly enum: { [P in T & string]: P } & Omit<{ [P in number | string | symbol]: P extends number | symbol ? never : T | undefined | null }, T>;

  // Supported Methods
  at(n: number): T | undefined;

  // Type override to prevent string not in type T issue
  includes<PP = T>(val: PP, fromIndex?: number): boolean;
  indexOf<PP = T>(searchElement: PP, fromIndex?: number): number;
  lastIndexOf<PP = T>(searchElement: PP, fromIndex?: number): number;

  find<PP = T & string>(
    predictate: (
      val: PP extends T & string ? T : PP,
      i: number,
      obj: T[]
    ) => val is PP extends T & string ? T : PP,
  ): T;
  find(
    predictate: (
      val: string | undefined,
      i: number,
      obj: T[]
    ) => boolean,
  ): T;
  findIndex<S = T & string>(predicate: (value: S & string, index: number, obj: T[]) => unknown, thisArg?: any): number;

  slice(start?: number, end?: number): MaybeReadonly<Mut, IStringList<T, Mut>>;

  some<S = T & string>(predicate: (value: S & string, index: number, array: T[]) => unknown, thisArg?: any): boolean;
  every<S = T & string>(predicate: (value: S & string, index: number, array: T[]) => value is S & string, thisArg?: any): this is S[];
  every(predicate: (value: T & string, index: number, array: T[]) => unknown, thisArg?: any): boolean;


  // Return Type overrides
  with<V extends string>(index: number, value: V): (T | V)[];
  filter<S = T & string>(
    predicate: (value: S & string, index: number, array: T[]) => value is S & string,
    thisArg?: any,
  ): S[];
  filter(
    predicate: (value: string, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): T & string[];
  toSpliced<S = T & string>(start: number, deleteCount: number, ...items: string[]): (S & string)[];
  pop(): [Mut] extends [true] ? T : never;
  shift(): [Mut] extends [true] ? T : never;
  unshift<S = T & string>(...newElement: S[]): [Mut] extends [true] ? number : never;
  push<S = T & string>(...items: S[]): [Mut] extends [true] ? number : never;
  splice(start: number, deleteCount?: number): [Mut] extends [true]
    ? T[]
    : never;
  copyWithin<S = T & string>(target: number, start: number, end?: number): [Mut] extends [true] ? S[] : never;
  fill<S = T, U = T & string>(
    value: (U | undefined)[],
    start?: number,
    end?: number,
  ): [Mut] extends [true] ? U[] : never;
  fill<U = T & string>(
    value: U,
    start?: number,
    end?: number,
  ): [Mut] extends [true] ? U[] : never;
  // join<D extends string = ''>(delimiter?: D): sl.utils.Join<SS, D>;
}


export class SL {
  literal: undefined;
  constructor(...list: string[]);
  mutable(): string[];
}
