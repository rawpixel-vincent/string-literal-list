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

export type MaybeReadonly<T extends boolean, A> = [T] extends [true]
  ? Readonly<A>
  : A;

export interface IStringList<
  T extends string,
  Tupple extends readonly string[],
  Mut extends boolean = false,
  Unsorted extends boolean = false,
> extends Omit<Array<T>, sl.specs.ImplementedMethod>,
  ILiterals<T> {
  // Custom Methods
  withPrefix<P extends string = ''>(
    prefix: P,
  ): sl.utils.UnionToTuple<
    sl.utils.StringConcat<P extends string ? P : '', Tupple[number]>
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;
  withSuffix<P extends string>(
    suffix: P,
  ): sl.utils.UnionToTuple<
    sl.utils.StringConcat<Tupple[number], P extends string ? P : ''>
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  withDerivatedSuffix<S extends string>(
    chars: S,
  ): sl.utils.UnionToTuple<
    T | sl.utils.DropSuffix<sl.utils.DropSuffix<`${T}${S}${S}`, S>, `${S}${S}`>
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  withDerivatedPrefix<S extends string>(
    chars: S,
  ): sl.utils.UnionToTuple<
    T | sl.utils.DropPrefix<sl.utils.DropPrefix<`${S}${S}${T}`, S>, `${S}${S}`>
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  withReplace<S extends string | RegExp, D extends string>(
    searchValue: S,
    replaceValue: D,
  ): sl.utils.UnionToTuple<sl.utils.Replace<T, S, D>> extends infer W extends
  readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  withReplaceAll<S extends string | RegExp, D extends string>(
    searchValue: S,
    replaceValue: D,
  ): sl.utils.UnionToTuple<sl.utils.ReplaceAll<T, S, D>> extends infer W extends
  readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  withTrim(): sl.utils.UnionToTuple<sl.utils.Trim<T>> extends infer W extends
    readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;
  value(val): T;
  mutable(): T & string[];
  sort<P1 = T, P2 = T>(compareFn?: (a: P1, b: P2) => number): MaybeReadonly<Mut, IStringList<T, Tupple, Mut, true>>;
  reverse(): MaybeReadonly<Mut, IStringList<T, Tupple, Mut, true>>;
  without<PP extends T & string, S extends string>(
    ...arg: readonly (ILiterals<S> | S)[]
  ): sl.utils.UnionToTuple<Exclude<PP | S, S>> extends infer W extends
  readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  // Implemented methods to return the frozen array, typed as IStringList.
  toSorted(
    compareFn?: (a: T, b: T) => number,
  ): MaybeReadonly<Mut, IStringList<T, Tupple, Mut, true>>;
  toReversed(): MaybeReadonly<Mut, IStringList<T, Tupple, Mut, true>>;

  concat<PP extends T, S extends string>(
    ...arg: (ILiterals<S> | S)[]
  ): MaybeReadonly<
    Mut,
    IStringList<
      PP | S,
      [
        ...[
          Tupple[number],
          [
            S extends string ? sl.utils.UnionToTuple<S>[number] : [][number],
          ][number],
        ],
      ],
      Mut,
      [Tupple] extends [[]] ? false : true
    >
  >;

  // Readonly overrides
  readonly length: number;
  readonly [n: number]: T | undefined;
  readonly enum: { [P in T & string]: P } & Omit<
    {
      [P in number | string | symbol]: P extends number | symbol
      ? never
      : T | undefined | null;
    },
    T
  >;

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
      obj: T[],
    ) => val is PP extends T & string ? T : PP,
  ): T;
  find(
    predictate: (val: string | undefined, i: number, obj: T[]) => boolean,
  ): T;
  findIndex<S = T & string>(
    predicate: (value: S & string, index: number, obj: T[]) => unknown,
    thisArg?: any,
  ): number;

  slice<Start extends number = 0, End extends number = Tupple['length']>(
    start?: Start,
    end?: End,
  ): [Start, End] extends [0, Tupple['length']]
    ? this
    : [sl.utils.IsNegative<Start>] extends [true]
    ? MaybeReadonly<Mut, IStringList<T, Tupple, Mut, true>>
    : [sl.utils.IsNegative<End>] extends [true]
    ? MaybeReadonly<Mut, IStringList<T, Tupple, Mut, true>>
    : sl.utils.TupleSlice<Tupple, Start, End> extends infer W extends
    readonly string[]
    ? [W] extends [Tupple]
    ? MaybeReadonly<Mut, IStringList<T, Tupple, Mut, true>>
    : MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  some<S = T & string>(
    predicate: (value: S & string, index: number, array: T[]) => unknown,
    thisArg?: any,
  ): boolean;
  every<S = T & string>(
    predicate: (
      value: S & string,
      index: number,
      array: T[],
    ) => value is S & string,
    thisArg?: any,
  ): this is S[];
  every(
    predicate: (value: T & string, index: number, array: T[]) => unknown,
    thisArg?: any,
  ): boolean;

  // Return Type overrides
  /**
   * @deprecated This method does not support type inference and will return a mutable T[] array.
   */
  with<V extends string>(index: number, value: V): (T | V)[];
  filter<S = T & string>(
    predicate: (
      value: S & string,
      index: number,
      array: T[],
    ) => value is S & string,
    thisArg?: any,
  ): S[];
  filter(
    predicate: (value: string, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): T & string[];
  toSpliced<S = T & string>(
    start: number,
    deleteCount: number,
    ...items: string[]
  ): (S & string)[];
  /**
  * @deprecated This method will mutate the list, Get the mutable array with `list.mutable()`
  * Or to obtain a modified list without the last element use:
  * `const lastElement = list[list.length - 1]` and then remove it using `const newlist = list.without(lastElement)`.
  */
  pop(): [Mut] extends [true] ? T : never;
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   * Or use `const firstElement = list[0]` and then remove it using `const newlist = list.without(firstElement)`.
   */
  shift(): [Mut] extends [true] ? T : never;
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   * Or use `const newlist = stringList('el', list);`.
   */
  unshift<S = T & string>(
    ...newElement: S[]
  ): [Mut] extends [true] ? number : never;
  /**
   * @deprecated This method will mutate the list, use `list.concat()` or get the mutable array with `list.mutable()`
   */
  push<S = T & string>(...items: S[]): [Mut] extends [true] ? number : never;
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   * Or to obtain a modified list use:
   * `list.toSpliced())`.
   */
  splice(
    start: number,
    deleteCount?: number,
  ): [Mut] extends [true] ? T[] : never;
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   */
  copyWithin<S = T & string>(
    target: number,
    start: number,
    end?: number,
  ): [Mut] extends [true] ? S[] : never;
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   */
  fill<S = T, U = T & string>(
    value: (U | undefined)[],
    start?: number,
    end?: number,
  ): [Mut] extends [true] ? U[] : never;
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   */
  fill<U = T & string>(
    value: U,
    start?: number,
    end?: number,
  ): [Mut] extends [true] ? U[] : never;
  join<D extends string = ''>(
    delimiter?: D,
  ): [Unsorted] extends [true]
    ? [Tupple] extends [[]]
    ? D extends string
    ? D
    : ''
    : string
    : sl.utils.Join<Tupple, D extends string ? D : ''>;
}

export class SL {
  literal: undefined;
  constructor(...list: string[]);
  mutable(): string[];
}
