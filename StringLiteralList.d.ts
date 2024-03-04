import { sl } from './types.js';

interface ILiterals<T extends unknown = null> {
  readonly literal: T;
}

export interface IStringList<T extends unknown>
  extends Omit<
    Array<T>,
    | sl.specs.ImplementedMethod
    | sl.specs.OmitedMutableMethod
    | sl.specs.NativeMethodWithTypeOverride
  >, ILiterals<T> {
  // Custom Methods
  withPrefix<P extends string>(
    prefix: P,
  ): IStringList<sl.utils.StringConcat<P, T extends string ? T : string>>;
  withSuffix<P extends string>(
    suffix: P,
  ): IStringList<sl.utils.StringConcat<T extends string ? T : string, P>>;
  value<V extends T & string>(val: V): V extends T ? V : never;
  mutable(): string[];

  // Implemented methods to return the frozen array, typed as IStringList.
  toSorted(compareFn?: (a: T, b: T) => number): IStringList<T>;
  toReversed(): IStringList<T>;

  concat<PP extends T, S extends string>(...arg: (ILiterals<S> | S)[]): Readonly<IStringList<PP | S>>;

  // Readonly overrides
  readonly length: number;
  readonly [n: number]: T | undefined;

  // Supported Methods
  at(n: number): T;

  // Type override to prevent string not in type T issue
  includes<PP = T>(val: PP, fromIndex?: number): boolean;
  indexOf<PP = T>(searchElement: PP, fromIndex?: number): number;
  lastIndexOf<PP = T>(searchElement: PP, fromIndex?: number): number;

  find<PP = T>(
    predictate: (
      val: PP extends T ? T : PP,
      i: number,
      obj: IStringList<T>,
    ) => val is PP extends T ? T : PP,
  ): T;
  find(
    predictate: (
      val: string | undefined,
      i: number,
      obj: IStringList<T>,
    ) => boolean,
  ): T;
  findIndex<PP = T>(
    predictate: (val: PP extends T ? PP : string) => boolean,
  ): number;
  findIndex(
    predictate: (
      val: string | undefined,
      i: number,
      obj: IStringList<T>,
    ) => boolean,
  ): number;

  some<PP = T>(
    predictate: (val: PP extends T ? PP : string) => boolean,
  ): boolean;
  every<PP = T>(
    predictate: (val: PP extends T ? PP : string) => boolean,
  ): boolean;

  // Return Type overrides
  with(index: number, value: any): string[];
  filter<S extends T>(
    predicate: (value: T, index: number, array: IStringList<T>) => value is S,
    thisArg?: any,
  ): S[];
  filter(
    predicate: (value: string, index: number, array: IStringList<T>) => boolean,
    thisArg?: any,
  ): string[];
  toSpliced(start: number, deleteCount: number, ...items: string[]): string[];
}

export class SL<T extends string> {
  constructor(...list: T[]);
}

export interface ArrayInPlaceMutation {
  push: 'push';
  slice: 'slice';
  sort: 'sort';
  unshift: 'unshift';
  shift: 'shift';
  copyWithin: 'copyWithin';
  pop: 'pop';
  fill: 'fill';
  splice: 'splice';
  reverse: 'reverse';
}

export const ARRAY_IN_PLACE_MUTATION: ArrayInPlaceMutation;
