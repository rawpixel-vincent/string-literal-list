import { sl } from './types.js';

export interface IStringList<T extends unknown>
  extends Omit<
    Array<T>,
    | sl.specs.ImplementedMethod
    | sl.specs.OmitedMutableMethod
    | sl.specs.NativeMethodWithTypeOverride
  > {
  // Custom Methods
  withPrefix<P extends string>(
    prefix: P,
  ): IStringList<sl.utils.StringConcat<P, T extends string ? T : string>>;
  withSuffix<P extends string>(
    suffix: P,
  ): IStringList<sl.utils.StringConcat<T extends string ? T : string, P>>;
  mutable(): string[];

  // Implemented methods to return the frozen array, typed as IStringList.
  toSorted(compareFn?: (a: T, b: T) => number): IStringList<T>;
  toReversed(): IStringList<T>;
  concat<PP extends T, P extends string = string>(
    ...arg: P[]
  ): IStringList<Record<P, P>[keyof Record<P, P>] | PP>;

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

export class StringLiteralList<T extends string> {
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
