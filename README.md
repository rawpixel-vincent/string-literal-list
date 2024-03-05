[![tests](https://github.com/rawpixel-vincent/string-literal-list/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/rawpixel-vincent/string-literal-list/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/string-literal-list)](https://www.npmjs.com/package/string-literal-list)

# Array for string literals

Typed array of string literals working at runtime without typescript compilation.

Useful for types constructs that can be used at runtime.

*If you code in typescript, you probably don't need any of this.*

Thanks to @gustavoguichard and his work on https://github.com/gustavoguichard/string-ts that taught me how to work with string literals.

## Overview

The StringList class extends the Array interface types to work with string literals.

- immutable: methods that mutate the array in place like push, pop, shift, unshift, splice are not working, it's possible to escape the list to a mutable array with the method `mutable()`

- inference: concat, toReversed, toSorted and slice methods are implemented to return a new frozen instance and will infer the new values.
  - the concat method parameters types has been updated to accept strings literals and/or instances of StringList.
  - slice method will not infer the missing terms, but is exposed for compatibility.

- search methods: includes, indexOf, find, every, some, filter, etc... types are updated to prevent type errors when comparing with non-literals strings.

- not chainable or iterator: map / filter / reduce / flat / values / keys / entries are the same as the native Array, and will return the type defined by the native method.

- no changes is made to the execution of the methods to minimize maintenance, bugs or breaking changes. Types on the other hand are subjects to bugs and breaking changes, or incompatibilities with typescript and es versions.

- `mutable():string[]` has been implemented to return a copy of the underlying array as string[].

- an `enum` property is available to access the string literals. It's a frozen object built from the array values, it's used as a lookup instead of the array, but the primary intent is for convenience. This construct is not meant to manipulate millions of strings.

- then additional methods for string literals and type constructs are implemented:
  - `without(...$)`: opposite of concat, accept string / list parameters.
  - `withPrefix($)`: add prefix to all the words.
  - `withSuffix($)`: add suffix to all the words.
  - `withDerivatedPrefix($)` and `withDerivatedSuffix($)`: Generate words variants with or without the given suffix/prefix depending on their presence.
  - `value($)`: similar to enum but throws an error if the value doesn't exists.
  - `enum[$]:$` Object is exposed as readonly.
  - `withTrim()`: trim all the words.
  - `withReplace(search, replacement)`: call the String.prototype.replace on all the words.
  - `withReplaceAll(search, replacement)`: call the String.prototype.replaceAll on all the words.

## Installation

```bash
npm install --save string-literal-list
```

```bash
yarn add string-literal-list
```

### Code

```js
import { stringList } from 'string-literal-list';

let v = stringList("foo", "bar", ...) => SL<"foo" | "bar">;

v.enum.foo => "foo"

v.includes(anyValue) => boolean;

v.withPrefix('prefix.') => SL<"prefix.foo" | "prefix.bar">

v.withSuffix('.suffix') => SL<"foo.suffix" | "bar.suffix">

v.concat('zing', 'boom', stringList('zig', 'zag')) => SL<"foo" | "bar" | "zing" | "boom" | "zig" | "zag">;

v.value('foo') => 'foo';

v.value('not') => throws;

v.withDerivatedSuffix('s') => SL<"foo" | "foos" | "bars" "bar">;
v.withDerivatedPrefix('#') => SL<"foo" | "#foo" | "bar" | "#bar">;

v.withTrim() => SL<"foo" | "bar">;
v.withReplace('a', 'e') => SL<"foo" | "ber">;
v.withReplaceAll('o', 'e') => SL<"fee" | "bar">;

v.without('foo') => SL<"bar">;
```

```js
import { stringList } from 'string-literal-list';

const list = stringList(
  'foo',
  'bar',
);
// SL<"foo" | "bar">;

list.enum;
// => { foo: "foo", bar: "bar" };


const prefixed = list.withPrefix('prefix.');
// SL<"prefix.foo" | "prefix.bar">;

const suffixed = list.withSuffix('.suffix');
// SL<"foo.suffix" | "bar.suffix">;

const concat = prefixed.concat(...suffixed);
// SL<"prefix.foo" | "prefix.bar" | "foo.suffix" | "bar.suffix">;

const without = concat.without('prefix.foo').without('bar.suffix');
// SL<"prefix.bar" | "foo.suffix">;

const bothWay = list.withPrefix('data.').withSuffix('.ext');
// SL<"data.foo.ext" | "data.bar.ext">;

/** @type {any|unknown|'notInTheList'} */
let val;
list.includes(val); // No type error just boolean result.
// list implements similar fix for indexOf, lastIndexOf, filter, some, every, findIndex and find methods.

// Get a copy of the underlying array -> T[]
const arr = list.mutable(); // => ["foo", "bar"]

// access a value in the list
list.value('foo'); // 'foo'
list.value('n'); // throws error

// Generate words variants with or without the given suffix/prefix depending on their presence.
const foods = stringList('food', 'bars', 'pasta', 'meatballs');
foods.withDerivatedSuffix('s'); => SL<"food" | "bars" | "pasta" | "meatballs" | "foods" | "bar" | "pasta" | "meatball">

const tags = stringList('spring', '#boot', '#typescript', 'fundamentals');
tags.withDerivatedPrefix('#'); => SL<"#spring" | "#boot" | "#typescript" | "#fundamentals" | "spring" | "boot" | "typescript" | "fundamentals">

const scored = stringList('if has ', 'spaces', ' between ', ' o r', 'into the words').withTrim().withReplaceAll(' ', '_') => SL<"if_has" | "spaces" | "between" | "o_r" |"into_the_words">
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

### filter / map / reduce / slice and other array methods

The results of those methods will result in type loose `string[]` or returned `U[]` for map / reduce.

### References

See ./types.d.ts and ./StringLiteralList.d.ts for more info on the methods which methods are available and specific type overrides.

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
