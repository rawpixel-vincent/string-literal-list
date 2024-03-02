type StringConcat<
  T1 extends string | number | bigint | boolean,
  T2 extends string | number | bigint | boolean,
> = `${T1}${T2}`;

type MutableMethod =
  | 'push'
  | 'slice'
  | 'sort'
  | 'unshift'
  | 'shift'
  | 'copyWithin'
  | 'pop'
  | 'fill'
  | 'splice'
  | 'reverse';

type ImplementedMethod =
  | 'indexOf'
  | 'lastIndexOf'
  | 'mutable'
  | 'concat'
  | 'at'
  | 'withPrefix'
  | 'withSuffix'
  | 'toReversed'
  | 'toSorted';

type SupportedMethod =
  | 'includes'
  | 'toSpliced'
  | 'length'
  | 'find'
  | 'findIndex'
  | 'some'
  | 'every'
  | 'filter';

type SupportedMethodWithNativeType =
  | 'map'
  | 'reduce'
  | 'reduceRight'
  | 'entries'
  | 'keys'
  | 'values'
  | 'toLocaleString'
  | 'toString'
  | 'forEach'
  | 'flat'
  | 'flatMap'
  | 'join';

declare global {
  namespace isl {
    interface ISL<T = string | unknown>
      extends Omit<
        Array<T>,
        ImplementedMethod | MutableMethod | SupportedMethod
      > {
      toSorted(compareFn?: (a: T, b: T) => number): ISL<T>;
      toReversed(): ISL<T>;
      concat<PP = T, P extends string = string>(
        ...arg: P[]
      ): ISL<Record<P, P>[keyof Record<P, P>] | PP>;
      withPrefix<P extends string = string>(
        prefix: P,
      ): T extends string ? ISL<StringConcat<P, T>> : never;
      withSuffix<P extends string = string>(
        suffix: P,
      ): T extends string ? ISL<StringConcat<T, P>> : never;
      mutable(): string[];

      at(n: number): T?;
      readonly length: number;
      readonly [n: number]: T | undefined;

      // Supported Methods

      // Type override to prevent string not in type T issue
      includes<PP = T>(val: PP, fromIndex?: number): boolean;
      indexOf<PP = T>(searchElement: PP, fromIndex?: number): number;
      lastIndexOf<PP = T>(searchElement: PP, fromIndex?: number): number;

      find<PP = T>(
        predictate: (
          val: PP extends T ? PP : string,
          i: number,
          obj: ISL<T>,
        ) => val is PP,
      ): T;
      find(predictate: (val?: string, i: number, obj: ISL<T>) => boolean): T;
      findIndex<PP = T>(
        predictate: (val: PP extends T ? PP : string) => boolean,
      ): number;
      findIndex(
        predictate: (val?: string, i: number, obj: ISL<T>) => boolean,
      ): number;

      some<PP = T>(
        predictate: (val: PP extends T ? PP : string) => boolean,
      ): boolean;
      every<PP = T>(
        predictate: (val: PP extends T ? PP : string) => boolean,
      ): boolean;

      // Return Type overrides
      filter<S extends T>(
        predicate: (value: T, index: number, array: ISL<T>) => value is S,
        thisArg?: any,
      ): S[];
      filter(
        predicate: (value: string, index: number, array: ISL<T>) => boolean,
        thisArg?: any,
      ): string[];
      toSpliced(
        start: number,
        deleteCount: number,
        ...items: string[]
      ): string[];
    }
  }
}

export { };
