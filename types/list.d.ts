import { sl } from './index.js';

export interface ILiterals<Tuple extends readonly string[] = readonly never[]> {
  /**
   * Namespace to expose the type inference.
   * The values are undefined and should not be used other than type inference.
   */
  infered: {
    Union: Tuple[number];
    Tuple: Tuple;
  };
}

export type MaybeReadonly<IsMutable extends boolean, A> = [IsMutable] extends [
  true,
]
  ? A
  : Readonly<A>;

type RecordTypes = {
  any: any;
  string: string;
  number: number;
  boolean: boolean;
  'string|number': string | number;
  'number|boolean': number | boolean;
  'any[]': any[];
  'string[]': string[];
  'number[]': number[];
  'boolean[]': boolean[];
  'Record<string, any>': Record<string, any>;
  'Record<number, any>': Record<number, any>;
  'Record<number, string>': Record<number, string>;
  'Record<number, number>': Record<number, number>;
  'Record<number, boolean>': Record<number, boolean>;
  'Record<string, string>': Record<string, string>;
  'Record<string, number>': Record<string, number>;
  'Record<string, boolean>': Record<string, boolean>;
  'Record<string, any[]>': Record<string, any[]>;
  'Record<string, string[]>': Record<string, string[]>;
  'Record<string, number[]>': Record<string, number[]>;
  'Record<string, boolean[]>': Record<string, boolean[]>;
};

type RecordType = keyof RecordTypes;

export interface IStringList<
  T extends string = never,
  Tuple extends readonly string[] = readonly never[],
  Mut extends boolean = true,
  Unsorted extends boolean = false,
> extends Omit<Array<T>, specs.ImplementedMethod>,
    ILiterals<Tuple> {
  // Custom Methods
  withPrefix<P extends string = ''>(
    prefix: P,
  ): sl.tuple.TuplePrefixed<
    Tuple,
    P extends string ? P : '',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  withSuffix<P extends string = ''>(
    suffix: P,
  ): sl.tuple.TupleSuffixed<
    Tuple,
    P extends string ? P : '',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  withDerivatedSuffix<S extends string>(
    chars: S,
  ): sl.tuple.UnionToTuple<
    | T
    | sl.string.DropSuffix<sl.string.DropSuffix<`${T}${S}${S}`, S>, `${S}${S}`>
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  withDerivatedPrefix<S extends string>(
    chars: S,
  ): sl.tuple.UnionToTuple<
    | T
    | sl.string.DropPrefix<sl.string.DropPrefix<`${S}${S}${T}`, S>, `${S}${S}`>
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  withReplace<S extends string, D extends string>(
    searchValue: S,
    replaceValue: D,
  ): sl.tuple.TupleWithReplace<Tuple, S, D, [], false> extends infer W extends
    readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  withReplaceAll<S extends string | RegExp, D extends string>(
    searchValue: S,
    replaceValue: D,
  ): sl.tuple.TupleWithReplace<Tuple, S, D, [], true> extends infer W extends
    readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  withTrim(): sl.tuple.TupleWithTrim<Tuple, []> extends infer W extends
    readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;
  toLowerCase(): sl.tuple.TupleWithCaseTransform<
    Tuple,
    'lowercase',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;
  toUpperCase(): sl.tuple.TupleWithCaseTransform<
    Tuple,
    'uppercase',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;
  toCapitalize(): sl.tuple.TupleWithCaseTransform<
    Tuple,
    'capitalize',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;
  toUnCapitalize(): sl.tuple.TupleWithCaseTransform<
    Tuple,
    'unCapitalize',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  toPascalCase(): sl.tuple.TupleWithCaseTransform<
    Tuple,
    'pascalCase',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;
  toSnakeCase(): sl.tuple.TupleWithCaseTransform<
    Tuple,
    'snakeCase',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;
  toCamelCase(): sl.tuple.TupleWithCaseTransform<
    Tuple,
    'camelCase',
    []
  > extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  value(val): T;
  mutable(): T & string[];
  sort<P1 = T, P2 = T>(
    compareFn?: (a: P1, b: P2) => number,
  ): MaybeReadonly<Mut, IStringList<T, Tuple, Mut, true>>;

  reverse(): sl.tuple.TupleReversed<Tuple, []> extends infer W extends
    readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : this;

  without<S extends string>(
    ...arg: readonly (ILiterals<readonly S[]> | S)[]
  ): sl.tuple.TupleWithExclude<Tuple, S, []> extends infer E extends
    readonly string[]
    ? MaybeReadonly<Mut, IStringList<E[number], E, Mut, Unsorted>>
    : never;

  toSorted(
    compareFn?: (a: T, b: T) => number,
  ): MaybeReadonly<Mut, IStringList<T, Tuple, Mut, true>>;

  toReversed(): sl.tuple.TupleReversed<Tuple, []> extends infer W extends
    readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
    : never;

  /**
   * @deprecated This method does not support type inference,
   * use `list.concat('str', 'str')` or `list.concatList(stringList('str','str'))` instead.
   */
  concat<S extends readonly string[]>(
    ...arg: S[]
  ): [...Tuple, S[number][number]] extends infer W extends readonly string[]
    ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, true>>
    : never;

  concat<S extends readonly string[]>(
    ...arg: S
  ): [...Tuple, ...S] extends infer W extends readonly string[]
    ? MaybeReadonly<
        Mut,
        IStringList<W[number], W, Mut, [Tuple] extends [[]] ? false : Unsorted>
      >
    : never;

  concatList<S extends readonly string[]>(
    arg: ILiterals<S>,
  ): S extends infer C extends readonly string[]
    ? readonly [...Tuple, ...C] extends infer W extends readonly string[]
      ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
      : this
    : this;

  toRecordType<
    RT extends RecordType = 'any',
    R extends Record<string, unknown>[] = [],
  >(
    type?: RT,
    initial?: RecordTypes[RT],
    ...records: R
  ): sl.record.Merge<[Record<T, RecordTypes[RT]>, ...R]>;

  toRecordValue<V extends unknown = any, R extends any[] = never>(
    initial?: V,
    ...records: R
  ): R[number] extends never
    ? Record<T, V>
    : sl.record.Merge<[Record<T, V>, ...R]>;

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

  slice<Start extends number = 0, End extends number = Tuple['length']>(
    start?: Start,
    end?: End,
  ): [[Start], [End]] extends [[0 | never], [Tuple['length'] | never]]
    ? this
    : sl.tuple.TupleSlice<
          Tuple,
          sl.tuple.GetTuplePositiveIndex<Tuple, Start>,
          sl.tuple.GetTuplePositiveIndex<Tuple, End>
        > extends infer W extends readonly string[]
      ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
      : never;

  toSpliced<Start extends number = 0>(
    start: Start,
  ): [Start] extends [0 | never]
    ? MaybeReadonly<Mut, IStringList<never, [], Mut, Unsorted>>
    : [sl.generic.IsNegative<Start>] extends [true]
      ? MaybeReadonly<Mut, IStringList<T, Tuple, Mut, Unsorted>>
      : sl.tuple.TupleSplit<Tuple, Start> extends readonly [infer C, infer R]
        ? C extends readonly string[]
          ? R extends readonly string[]
            ? MaybeReadonly<Mut, IStringList<C[number], C, Mut, Unsorted>>
            : never
          : never
        : never;

  toSpliced<Start extends number, DelCount extends number>(
    start: Start,
    deleteCount: DelCount,
  ): [
    sl.generic.IsNegative<
      sl.generic.Subtract<
        sl.generic.Subtract<
          Tuple['length'],
          [sl.generic.IsNegative<Start>] extends [true] ? 0 : Start
        >,
        1
      >
    >,
  ] extends [true]
    ? this
    : [
          [
            sl.generic.IsNegative<
              sl.generic.Subtract<
                sl.generic.Subtract<
                  Tuple['length'],
                  [DelCount] extends [number] ? DelCount : 0
                >,
                1
              >
            >,
          ],
          [Start],
          [DelCount],
        ] extends
          | [[true], [0], [any]]
          | [[any], [0], [Tuple['length']]]
          | [[any], [0], [never]]
      ? MaybeReadonly<Mut, IStringList<never, [], Mut, false>>
      : sl.tuple.TupleSplit<
            Tuple,
            [sl.generic.IsNegative<Start>] extends [true] ? 0 : Start
          > extends readonly [infer C, infer R]
        ? C extends readonly string[]
          ? R extends readonly string[]
            ? sl.tuple.TupleSplit<R, DelCount> extends readonly [
                infer D,
                infer E,
              ]
              ? E extends readonly string[]
                ? MaybeReadonly<
                    Mut,
                    IStringList<
                      C[number] | E[number],
                      readonly [...C, ...E],
                      Mut,
                      Unsorted
                    >
                  >
                : MaybeReadonly<Mut, IStringList<C[number], C, Mut, Unsorted>>
              : MaybeReadonly<Mut, IStringList<C[number], C, Mut, Unsorted>>
            : never
          : never
        : never;

  toSpliced<Start extends number, DelCount extends number, I extends string[]>(
    start: Start,
    deleteCount: DelCount,
    ...items: I
  ): [
    sl.generic.IsNegative<
      sl.generic.Subtract<
        sl.generic.Subtract<
          Tuple['length'],
          [sl.generic.IsNegative<Start>] extends [true] ? 0 : Start
        >,
        1
      >
    >,
  ] extends [true]
    ? readonly [...Tuple, ...I] extends infer W extends readonly string[]
      ? MaybeReadonly<Mut, IStringList<W[number], W, Mut, Unsorted>>
      : never
    : sl.tuple.TupleSplit<
          Tuple,
          sl.tuple.GetTuplePositiveIndex<Tuple, Start>
        > extends readonly [infer C, infer R]
      ? C extends readonly string[]
        ? R extends readonly string[]
          ? sl.tuple.TupleSplit<
              R,
              [sl.generic.IsNegative<DelCount>] extends [true] ? 0 : DelCount
            > extends readonly [infer D, infer E]
            ? E extends readonly string[]
              ? MaybeReadonly<
                  Mut,
                  IStringList<
                    C[number] | I[number] | E[number],
                    readonly [...C, ...I, ...E],
                    Mut,
                    Unsorted
                  >
                >
              : MaybeReadonly<
                  Mut,
                  IStringList<
                    C[number] | I[number],
                    readonly [...C, ...I],
                    Mut,
                    Unsorted
                  >
                >
            : MaybeReadonly<
                Mut,
                IStringList<
                  C[number] | I[number],
                  readonly [...I, ...C],
                  Mut,
                  Unsorted
                >
              >
          : never
        : never
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

  /**
   * @deprecated This method will mutate the list, Get the mutable array with `list.mutable()`
   * Or to obtain a modified list without the last element use:
   * `const lastElement = list[list.length - 1]` and then remove it using `const newlist = list.without(lastElement)`.
   */
  pop(): T | undefined;

  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   * Or use `const firstElement = list[0]` and then remove it using `const newlist = list.without(firstElement)`.
   */
  shift(): T | undefined;

  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   * Or use `const newlist = stringList('el', list);`.
   */
  unshift<S = T & string>(...newElement: S[]): number;

  /**
   * @deprecated This method will mutate the list, use `list.concat()` or get the mutable array with `list.mutable()`
   */
  push<S = T & string>(...items: S[]): number;

  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   * Or to obtain a modified list use:
   * `list.toSpliced())`.
   */
  splice(start: number, deleteCount?: number): T[];

  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   * Or to obtain a modified list use:
   * `list.toSpliced())`.
   */
  splice<Items extends string[] = []>(
    start: number,
    deleteCount: number,
    ...items: Items
  ): T[];

  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   */
  copyWithin<S = T & string>(target: number, start: number, end?: number): S[];
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   */
  fill<S = T, U = T & string>(
    value: (U | undefined)[],
    start?: number,
    end?: number,
  ): U[];
  /**
   * @deprecated This method will mutate the list, get the mutable array with `list.mutable()`
   */
  fill<U = T & string>(value: U, start?: number, end?: number): U[];
  join<D extends string = ''>(
    delimiter?: D,
  ): [Unsorted] extends [true]
    ? [Tuple['length']] extends [0]
      ? ''
      : string
    : [Tuple['length']] extends [0]
      ? ''
      : sl.tuple.Join<Tuple, D extends string ? D : ''>;
}

export {};
