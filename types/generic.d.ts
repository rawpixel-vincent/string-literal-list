/// <reference path="./index.d.ts" />

declare global {
  namespace StringLiteralList {}
  namespace StringLiteralList.generic {
    /**
     * Returns a tuple of the given length with the given type.
     */
    export type TupleOf<
      L extends number,
      T = unknown,
      result extends any[] = [],
    > = result['length'] extends L ? result : TupleOf<L, T, [...result, T]>;

    export type Subtract<A extends number, B extends number> = number extends
      | A
      | B
      ? number
      : TupleOf<A> extends [...infer U, ...TupleOf<B>]
        ? U['length']
        : 0;

    export type IsNegative<T extends number> = number extends T
      ? boolean
      : `${T}` extends `-${number}`
        ? true
        : false;

    export type Abs<T extends number> =
      `${T}` extends `-${infer U extends number}` ? U : T;

    /**
     * Returns true if input number type is a literal
     */
    export type IsNumberLiteral<T extends number> = [T] extends [number]
      ? [number] extends [T]
        ? false
        : true
      : false;

    export type IsBooleanLiteral<T extends boolean> = [T] extends [boolean]
      ? [boolean] extends [T]
        ? false
        : true
      : false;

    /**
     * Returns true if any elements in boolean array are the literal true (not false or boolean)
     */
    export type Any<Arr extends boolean[]> = Arr extends [
      infer Head extends boolean,
      ...infer Rest extends boolean[],
    ]
      ? IsBooleanLiteral<Head> extends true
        ? Head extends true
          ? true
          : Any<Rest>
        : Any<Rest>
      : false;

    export type Reject<tuple, cond, output extends any[] = []> = tuple extends [
      infer first,
      ...infer rest,
    ]
      ? Reject<rest, cond, first extends cond ? output : [...output, first]>
      : output;

    /**
     * Returns true if every element in boolean array is the literal true (not false or boolean)
     */
    export type All<Arr extends boolean[]> =
      IsBooleanLiteral<Arr[number]> extends true
        ? Arr extends [
            infer Head extends boolean,
            ...infer Rest extends boolean[],
          ]
          ? Head extends true
            ? Any<Rest>
            : false // Found `false` in array
          : true // Empty array (or all elements have already passed test)
        : false; // Array/Tuple contains `boolean` type

    export type UnionToIntersection<U> = (
      U extends never ? never : (arg: U) => never
    ) extends (arg: infer I) => void
      ? I
      : never;
  }
}

export {};
