/// <reference path="./generic.d.ts" />
/// <reference path="./string.d.ts" />
/// <reference path="./tuple.d.ts" />
/// <reference path="./list.d.ts" />
/// <reference path="./record.d.ts" />

import { ArrayInPlaceMutation } from '../StringLiteralList.js';

declare global {
  export namespace StringLiteralList {
    // @ts-ignore
    export * as tuple from './tuple.js';
    // @ts-ignore
    export * as list from './list.js';
    // @ts-ignore
    export * as record from './record.js';
    // @ts-ignore
    export * as string from './string.js';
    // @ts-ignore
    export * as generic from './generic.js';
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
      | 'concatList'
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

export { StringLiteralList as sl };
