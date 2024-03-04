import { sl } from './types.js';

interface ILiterals<T extends string> {
  literal: T;
}

export interface IStringList<T extends string>
  extends Omit<
    Array<T>,
    sl.specs.ImplementedMethod
  // | sl.specs.NativeMethodWithTypeOverride
  >, ILiterals<T> {
  // Custom Methods
  withPrefix<P extends string>(
    prefix: P,
  ): IStringList<sl.utils.StringConcat<P, T extends string ? T : string>>;
  withSuffix<P extends string>(
    suffix: P,
  ): IStringList<sl.utils.StringConcat<T extends string ? T : string, P>>;
  value<V = T>(val: V): V extends T ? V : never;
  mutable(): T & string[];
  sort<P1 = T, P2 = T>(compareFn?: (a: P1, b: P2) => number): this;
  reverse(): this;

  // Implemented methods to return the frozen array, typed as IStringList.
  toSorted(compareFn?: (a: T, b: T) => number): IStringList<T>;
  toReversed(): IStringList<T>;

  concat<PP extends T, S extends string>(...arg: (ILiterals<S> | S)[]): IStringList<PP | S>;

  // Readonly overrides
  readonly length: number;
  readonly [n: number]: T | undefined;
  readonly enum: { [P in T & string]: P };

  // Supported Methods
  at(n: number): T;

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
  pop(): T;
}

export class SL<T extends string> {
  constructor(...list: T[]);
}

export interface ArrayInPlaceMutation {
  push: 'push';
  unshift: 'unshift';
  shift: 'shift';
  copyWithin: 'copyWithin';
  pop: 'pop';
  fill: 'fill';
  splice: 'splice';
}

export const ARRAY_IN_PLACE_MUTATION: ArrayInPlaceMutation;
