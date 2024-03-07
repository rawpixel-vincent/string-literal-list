import { ArrayInPlaceMutation } from './StringLiteralList.js';

export namespace sl {
  export namespace utils {
    /**
     * @credit @gustavoguichard
     */
    /**
 * Returns a tuple of the given length with the given type.
 */
    type TupleOf<
      L extends number,
      T = unknown,
      result extends any[] = [],
    > = result['length'] extends L ? result : TupleOf<L, T, [...result, T]>

    export type Subtract<A extends number, B extends number> = number extends
      | A
      | B
      ? number
      : TupleOf<A> extends [...infer U, ...TupleOf<B>]
      ? U['length']
      : 0

    /**
     * Returns true if input number type is a literal
     */
    type IsNumberLiteral<T extends number> = [T] extends [number]
      ? [number] extends [T]
      ? false
      : true
      : false;

    type IsBooleanLiteral<T extends boolean> = [T] extends [boolean]
      ? [boolean] extends [T]
      ? false
      : true
      : false;

    export type IsNegative<T extends number> = number extends T
      ? boolean
      : `${T}` extends `-${number}`
      ? true
      : false

    /**
    * Returns true if any elements in boolean array are the literal true (not false or boolean)
    */
    type Any<Arr extends boolean[]> = Arr extends [
      infer Head extends boolean,
      ...infer Rest extends boolean[],
    ]
      ? IsBooleanLiteral<Head> extends true
      ? Head extends true
      ? true
      : Any<Rest>
      : Any<Rest>
      : false;

    /**
    * Returns true if every element in boolean array is the literal true (not false or boolean)
    */
    type All<Arr extends boolean[]> = IsBooleanLiteral<Arr[number]> extends true
      ? Arr extends [infer Head extends boolean, ...infer Rest extends boolean[]]
      ? Head extends true
      ? Any<Rest>
      : false // Found `false` in array
      : true // Empty array (or all elements have already passed test)
      : false; // Array/Tuple contains `boolean` type

    type IsStringLiteral<T extends string> = [T] extends [string] ? [string] extends [T] ? false : Uppercase<T> extends Uppercase<Lowercase<T>> ? Lowercase<T> extends Lowercase<Uppercase<T>> ? true : false : false : false;

    type IsStringLiteralArray<Arr extends string[] | readonly string[]> =
      IsStringLiteral<Arr[number]> extends true ? true : false;

    type UnionToIntersection<U> = (
      U extends never ? never : (arg: U) => never
    ) extends (arg: infer I) => void
      ? I
      : never;

    type UnionToTuple<T extends string> = UnionToIntersection<
      T extends never ? never : T extends string ? (t: T) => T : never
    > extends (_: never) => infer W
      ? readonly [...UnionToTuple<Exclude<T, W>>, W]
      : [];

    type TupleSplit<T, N extends number, O extends readonly any[] = readonly []> =
      O['length'] extends N ? [O, T] : T extends readonly [infer F, ...infer R] ?
      TupleSplit<readonly [...R], N, readonly [...O, F]> : [O, T]

    type TakeFirst<T extends readonly any[], N extends number> =
      TupleSplit<T, N>[0];

    type SkipFirst<T extends readonly any[], N extends number> =
      TupleSplit<T, N>[1];

    type TupleSlice<T extends readonly any[], S extends number, E extends number> =
      SkipFirst<TakeFirst<T, E>, S>

    export type StringConcat<
      T1 extends string | number | bigint | boolean,
      T2 extends string | number | bigint | boolean,
    > = `${T1}${T2}`;

    export type DropSuffix<
      sentence extends string,
      suffix extends string,
    > = string extends sentence | suffix
      ? string
      : sentence extends `${infer rest}${suffix}`
      ? rest
      : sentence;

    export type DropPrefix<
      sentence extends string,
      prefix extends string,
    > = string extends sentence | prefix
      ? string
      : sentence extends `${prefix}${infer rest}`
      ? rest
      : sentence;


    type TrimStart<T extends string> = IsStringLiteral<T> extends true ? T extends ` ${infer rest}` ? TrimStart<rest> : T : string;

    type TrimEnd<T extends string> = IsStringLiteral<T> extends true ? T extends `${infer rest} ` ? TrimEnd<rest> : T : string;

    type Trim<T extends string> = TrimEnd<TrimStart<T>>;

    type Replace<sentence extends string, lookup extends string | RegExp, replacement extends string = ''> = lookup extends string ? IsStringLiteral<lookup | sentence | replacement> extends true ? sentence extends `${infer rest}${lookup}${infer rest2}` ? `${rest}${replacement}${rest2}` : sentence : string : string;

    type ReplaceAll<sentence extends string, lookup extends string | RegExp, replacement extends string = ''> = lookup extends string ? IsStringLiteral<lookup | sentence | replacement> extends true ? sentence extends `${infer rest}${lookup}${infer rest2}` ? `${rest}${replacement}${ReplaceAll<rest2, lookup, replacement>}` : sentence : string : string;

    type Join<
      T extends readonly unknown[],
      delimiter extends string = '',
    > =
      T extends readonly string[] ?
      All<[IsStringLiteralArray<T>, IsStringLiteral<delimiter>]> extends true
      ? T extends readonly [
        infer first extends string,
        ...infer rest extends string[],
      ]
      ? rest extends []
      ? first
      : `${first}${delimiter}${Join<rest, delimiter>}`
      : ''
      : string : never;
  }

  export namespace specs {
    /**
     * @description
     * These methods changes the array in place.
     * This is incompatible with a typed list of constants.
     * They are omitted from StringList.
     * Note that the underlying array can be obtained from the `mutable(): string[]` method.
     */
    export type OmitedMutableMethod = keyof ArrayInPlaceMutation;

    /**
     * @description
     * These methods are implemented in StringList class to change the returned type to IStringList.
     * The execution is delegated to the Array instance and the result is used to construct the returned IStringList.
     */
    export type ImplementedMethod =
      | 'concat'
      | 'withPrefix'
      | 'withSuffix'
      | 'withDerivatedSuffix'
      | 'withDerivatedPrefix'
      | 'toReversed'
      | 'toSorted'
      | 'sort'
      | 'reverse'
      | 'slice'
      | 'value'
      | 'includes';

    /**
     * @description
     * These methods only get a type override to fix the comparison between `T` and `string`.
     */
    export type NativeMethodWithTypeOverride =
      | 'at'
      | 'indexOf'
      | 'lastIndexOf'
      | 'includes'
      | 'toSpliced'
      | 'length'
      | 'find'
      | 'findIndex'
      | 'some'
      | 'every'
      | 'filter'
      | 'with';

    /**
     * @description
     * These methods are the same are coming from the Array instance.
     * No type overrides here.
     * They will return the original type, (e.g. mutable array in case of map / reduce and other transforming methods.)
     */
    export type NativeMethod =
      | 'join'
      | 'toLocaleString'
      | 'toString'
      | 'entries'
      | 'keys'
      | 'values'
      | 'forEach'
      | 'map'
      | 'reduce'
      | 'reduceRight'
      | 'flat'
      | 'flatMap';
  }
}

export { };
