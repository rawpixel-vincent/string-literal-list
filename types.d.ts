import { ArrayInPlaceMutation } from './StringLiteralList.js';

export namespace sl {
  export namespace utils {
    type IsStringLiteral<T extends string> = [T] extends [string] ? [string] extends [T] ? false : Uppercase<T> extends Uppercase<Lowercase<T>> ? Lowercase<T> extends Lowercase<Uppercase<T>> ? true : false : false : false;

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
      | 'slice'
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
