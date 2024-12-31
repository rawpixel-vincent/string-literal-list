[![tests](https://github.com/rawpixel-vincent/string-literal-list/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/rawpixel-vincent/string-literal-list/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/string-literal-list)](https://www.npmjs.com/package/string-literal-list)

# Array for string literals

Array of string literals for the runtime.

_If you code in typescript, you probably don't need any of this._

## Overview

The StringList class extends the Array with new methods and supercharges the array interface to infer the string literals.

- Methods that mutate the array in place like push, pop, shift, unshift, splice should not be used, there is a strict export that enforce this restriction.

- no changes is made to the execution of the methods to minimize side effects and the interface is compatible with the native array to work with library expecting arrays.

- an `arr.enum` property is available to access the literals similar to the way an enum is accessed in typescript.

- then additional methods for string literals and type constructs are implemented:

  - `without(...$)`: filter out the given values, accept string and StringList.
  - `withPrefix($)` and `withSuffix($)`: add prefix/suffix to all the words.
  - `value($)`: similar to enum but throws an error if the value doesn't exists.
  - `enum[$]:$` Object is exposed as readonly.
  - `withTrim()`: trim all the words.
  - `withReplace(search, replacement)`: call the String.prototype.replace on all.
  - `withReplaceAll(search, replacement)`: call the String.prototype.replaceAll on all.
  - `to"Case"()` methods for case transform, uppercase, lowercase capitalize, etc...
  - `toRecordValue/toRecordType` methods to create a type of `Record<literal, type | typeof value>` with initial value and builtin or infered types.
  - `asMap` method to create a map of the literals.
  - `asSet` method to create a set of the literals.
  - `asObject` method to create an object of the literals.

The array order is preserved in a Tuple to infer the types when possible, some methods like toSorted will cause the new instance to be flagged as unsorted and methods like join() will return a generic string type.

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
// Or for a shorter alias
import { sl } from 'string-literal-list';
// Or with a frozen array throwing error on mutation.
// import { stringList } or { sl } from 'string-literal-list/strict.js';

let v = sl('foo', 'bar');
// SL<"["foo","bar"]>;

v.enum.foo;
// "foo"

v.includes(any);
// boolean;

v.withPrefix('prefix.');
// SL<["prefix.foo","prefix.bar"]>

v.withSuffix('.suffix');
// SL<["foo.suffix","bar.suffix"]>

v.concat('zing', 'boom');
// SL<["foo","bar","zing","boom"]>;

v.concatList(sl('zig', 'zag'));
// SL<["foo","bar","zig","zag"]>;

v.value('foo') => 'foo';
v.value('not') => throws;
v.enum['not'] => undefined;

v.withTrim()
// SL<["foo","bar"]>;
v.withReplace('a', 'e')
// SL<["foo","ber"]>;
v.withReplaceAll('o', 'e')
// SL<["fee","bar"]>;

v.without('foo')
// SL<["bar"]>;
```

```js
import { sl } from 'string-literal-list';

const list = sl('foo', 'bar');
// SL<"foo" | "bar">;

list.enum;
// => { foo: "foo", bar: "bar" };

const prefixed = list.withPrefix('prefix.');
// SL<["prefix.foo","prefix.bar"]>;

const suffixed = list.withSuffix('.suffix');
// SL<["foo.suffix","bar.suffix"]>;

const concat = list.concat('bar', 'foo');
// SL<["foo","bar","bar","foo"]>

const concatList = prefixed.concatList(suffixed);
// SL<["prefix.foo","prefix.bar","foo.suffix","bar.suffix"]>;
concatList.join('::');
// "prefix.foo::prefix.bar::foo.suffix::bar.suffix"

const without = concatList.without('prefix.foo', 'bar.suffix');
const withoutList = concatList.without(sl('prefix.foo', 'bar.suffix'));
// SL<["prefix.bar","foo.suffix"]>;

const bothWay = list.withPrefix('data.').withSuffix('.ext');
// SL<["data.foo.ext",data.bar.ext"]>;

/** @type {any|unknown|'notInTheList'} */
let val;
list.includes(val); // No type error just boolean result.

if (list.includes(val)) {
  // val type is now 'foo' | 'bar'
}

const valKnown = Math.random() > 0.5 ? 'notInTheList' : 'foo';
// valKnown type is 'foo' | 'notInTheList'
if (list.includes(valKnown)) {
  // valKnown type is now 'foo'
} else if (val !== 'notInTheList') {
  // valKnown type is now never
} else {
  // valKnown type is 'notInTheList'
}

// similar types fix for indexOf, lastIndexOf, filter, some, every, findIndex and find methods.

// Get a copy of the underlying array -> T[]
const arr = list.mutable(); // => ["foo","bar"]

// access a value in the list
list.value('foo'); // 'foo'
list.value('n'); // throws error

const scored = sl(' has ', 'spaces', ' between ', ' o r', 'in the words')
  .withTrim()
  .withReplaceAll(' ', '_');
// => SL<["has","spaces","between","o_r","in_the_words"]>

const Upper = sl('foo', 'bar').toUpperCase();
// SL<["FOO","BAR"]>
```

#### list.concat(...(string)[]) and list.concatList(sl)

`list.concat()` accept only string as arguments to enable inference.
If a native array is passed the string literals won't be inferred.
`list.concatList()` accept 1 list of string literals.

```js
// Inferred
sl('foo', 'bar').concat('zing', 'foo').concatList(sl('gurgle', 'doink'));
// SL<["foo","bar",'zing','foo','gurgle','doink']>

// Not Inferred.
list.concat(['boom', 'bar']);
```

### filter / map / reduce and other array methods

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

## Credits

Thanks to @gustavoguichard and his work on https://github.com/gustavoguichard/string-ts that taught me how to work with string literals.
