import { ArrayInPlaceMutation } from './StringLiteralList.js';

export namespace sl {
  export namespace utils {
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
      | 'toReversed'
      | 'toSorted'
      | 'value';

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
