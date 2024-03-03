[![tests](https://github.com/rawpixel-vincent/string-list/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/rawpixel-vincent/string-list/actions/workflows/tests.yml)

# Array for string literals

Typed array of string literals working at runtime without typescript compilation.

Useful for types constructs that can be used at runtime.

*If you code in typescript, you probably don't need any of this.*

## Overview

The StringList class extends the Array interface types to work with string literals.

- immutable: methods that mutate the array in place like push, pop, shift, unshift, splice are omitted.

- inference: concat, toReversed and toSorted methods are implemented to return a new frozen instance and will infer the new values.
  - the concat method parameters types has been updated to accept strings literals and/or instances of StringList.

- search methods: includes, indexOf, find, every, some, filter, etc... types are updated to prevent type errors when comparing with non-literals strings.

- not chainable or iterator: map / filter / reduce / flat / values / keys / entries are the same as the native Array, and will return the type defined by the native method.

- no changes is made to the execution of the methods to minimize maintenance, bugs or breaking changes. Types on the other hand are subjects to bugs and breaking changes, or incompatibilities with typescript and es versions.

- `mutable():string[]` has been implemented to return a copy of the underlying array as string[].

- more methods relevants to string literals and type constructs could be added along the way.

```js
import { stringList } from 'string-literal-list';

let v = stringList("foo", "bar", ...) => SL<"foo" | "bar">;

v.includes(anyValue) => boolean;

v.withPrefix('prefix.') => SL<"prefix.foo" | "prefix.bar">

v.withSuffix('.suffix') => SL<"foo.suffix" | "bar.suffix">

v.concat('zing', 'boom', stringList('zig', 'zag')) => SL<"foo" | "bar" | "zing" | "boom" | "zig" | "zag">;

```

## Installation

```bash
npm install --save string-literal-list
```

```bash
yarn add string-literal-list
```

### Usage

```js
import { stringList } from 'string-literal-list';

const list = stringList(
  'foo',
  'bar',
);
// SL<"foo" | "bar">;

const prefixed = list.withPrefix('prefix.');
// SL<"prefix.foo" | "prefix.bar">;

const suffixed = list.withSuffix('.suffix');
// SL<"foo.suffix" | "bar.suffix">;

const concat = prefixed.concat(...suffixed);
// SL<"prefix.foo" | "prefix.bar" | "foo.suffix" | "bar.suffix">;

const bothWay = list.withPrefix('data.').withSuffix('.ext');
// SL<"data.foo.ext" | "data.bar.ext">;

/** @type {any|unknown|'notInTheList'} */
let val;
list.includes(val); // No type error just boolean result.
// list implements similar fix for indexOf, lastIndexOf, filter, some, every, findIndex and find methods.
```

#### list.concat(...(string|StringList)[])

`list.concat()` accept only string and StringList as arguments to enable inference.
If a native array is passed the string literals won't be inferred.

```js
// OK
list.concat('zing', 'foo', stringList('gurgle', 'doink'));
=> SL<"foo" | "bar" | 'zing' | 'gurgle' | 'doink'>

// Not OK.
list.concat('zing', 'foo', ['boom', 'bar']);
// => Argument of type '"foo"' is not assignable to parameter of type '"zing" | ILiterals<"zing">'.ts(2345)
```

### filter / map / reduce and other array methods

The results of those methods will result in type loose `string[]` or returned `U[]` for map / reduce.

### References

See the namespace `sl.specs` (./types.d.ts) to know which methods are available and specific type overrides.

```js
namespace specs {
  export type OmitedMutableMethod =
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

  /**
   * @description
   * The execution is delegated to the Array instance methods.
   * The implementation uses the result to return a new readonly list instance.
   */
  type ImplementedMethod =
    | 'concat'
    | 'withPrefix'
    | 'withSuffix'
    | 'toReversed'
    | 'toSorted';

  /**
   * @description
   * The type of these methods are updated to fix ts value comparison between `T` and `string`.
   */
  type NativeMethodWithTypeOverride =
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
   * No type or any overrides.
   * filter, map, flatMap, flat will result in the original array type.
   */
  type NativeMethod =
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
```

## Why?

The javascript Array interface is not designed to work with constant string literal.

The methods like concat, or includes will expect only the constants as argument, which makes a method like includes() useless, and others build method annoying to type when constructing the constants.

### workarounds

- includes(): using mapped object in your code instead of the array, e.g. `!!MY_LIST_AS_unnecessary_MAP[val]`, but if you want type safety this means no .concat(), no .includes(), no iteration without creating new variables.
- concat(): just concatenate your workarounds into a single type. e.g. `/** @type {((keyof typeof MAP_A) | MAPPED_FROM_MAP_B)[]} */` not solving any issues with the underlying unusable array methods.

### Code showing the problem using typed array

```js
// Not typed.
const arr = ['foo', 'bar'];
/// const arr: string[]
arr.push('d'); // OK
arr.includes('zing'); // OK
arr.concat(['zing']); // OK

// Typed
const O = {
  foo: 'foo',
  bar: 'bar',
};
/** @type { (keyof typeof O)[] } */
// @ts-expect-error "Type 'string' is not assignable to type '"foo" | "bar"'
const lit = Object.keys(O);
// or just
/** @type {('foo' | 'bar')[]} */
const lit = new Array('foo', 'bar'); // OK
// const lit: ('foo' | 'bar')[]

// Then

lit.includes('asd');
// Argument of type '"asd"' is not assignable to parameter of type '"foo" | "bar"'.ts(2345)
let val = 'asd';
lit.includes(val);
// Argument of type 'string' is not assignable to parameter of type '"foo" | "bar"'.ts(2345)
lit.concat([val]);
// No overload matches this call.
//   Overload 1 of 2, '(...items: ConcatArray<"foo" | "bar">[]): ("foo" | "bar")[]', gave the following error.
//     Type 'string' is not assignable to type '"foo" | "bar"'.
//   Overload 2 of 2, '(...items: ("foo" | "bar" | ConcatArray<"foo" | "bar">)[]): ("foo" | "bar")[]', gave the following error.
//     Argument of type 'string[]' is not assignable to parameter of type '"foo" | "bar" | ConcatArray<"foo" | "bar">'.
//       Type 'string[]' is not assignable to type 'ConcatArray<"foo" | "bar">'.
//         The types returned by 'slice(...)' are incompatible between these types.
//           Type 'string[]' is not assignable to type '("foo" | "bar")[]'.
//             Type 'string' is not assignable to type '"foo" | "bar"'.ts(2769)
lit.concat(val);
// No overload matches this call.
//   Overload 1 of 2, '(...items: ConcatArray<"foo" | "bar">[]): ("foo" | "bar")[]', gave the following error.
//     Argument of type 'string' is not assignable to parameter of type 'ConcatArray<"foo" | "bar">'.
//   Overload 2 of 2, '(...items: ("foo" | "bar" | ConcatArray<"foo" | "bar">)[]): ("foo" | "bar")[]', gave the following error.
//     Argument of type 'string' is not assignable to parameter of type '"foo" | "bar" | ConcatArray<"foo" | "bar">'.ts(2769)
```
