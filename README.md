# Array for string literals

For runtime type safe array of string literal without compilation.

*If you code in typescript, you probably don't need any of this.*

## Why?

The javascript Array interface is not designed to work with constant string literal.

The methods like concat, or includes will expect only the constants as argument, which makes a method like includes() useless, and others build method annoying to type when constructing the constants.

### The js workarounds

- includes(): using mapped object in your code instead of the array, e.g. `!!MY_LIST_AS_unnecessary_MAP[val]`, but if you want type safety this means no .concat(), no .includes(), no iteration without creating new variables.
- concat(): just concatenate your workarounds into a single type. e.g. `/** @type {((keyof typeof MAP_A) | MAPPED_FROM_MAP_B)[]} */` not solving any issues with the underlying unusable array methods.

### Code demonstrating the problem

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

## The "solution"

stringList extends the native Array types to works with string literals.
it omits the methods that mutate the array in place like push, pop, shift, unshift, splice.

### Overview

```js
import { stringList } from 'string-literal-list';

let v = stringList("foo", "bar", ...) => StringList<"foo" | "bar">;

v.includes(anyValue) => boolean;

v.withPrefix('prefix.') => StringList<"prefix.foo" | "prefix.bar">

v.withSuffix('.suffix') => StringList<"foo.suffix" | "bar.suffix">

v.concat('zing', 'boom') => StringList<"foo" | "bar" | "zing" | "boom">

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
// literals types are inferred
// list: stringList<"foo" | "bar">;

const prefixed = list.withPrefix('prefix.');
// stringList<"prefix.foo" | "prefix.bar">;

const suffixed = list.withSuffix('.suffix');
// stringList<"foo.suffix" | "bar.suffix">;

const concat = prefixed.concat(...suffixed);
// stringList<"prefix.foo" | "prefix.bar" | "foo.suffix" | "bar.suffix">;

const bothWay = list.withPrefix('data.').withSuffix('.ext');
// stringList<"data.foo.ext" | "data.bar.ext">;

/** @type {any|unknown|'notInTheList'} */
let val;
list.includes(val); // No type error just boolean result.
// list implements similar fix for indexOf, lastIndexOf, filter, some, every, findIndex and find methods.
```

#### list.concat vs array.concat

list.concat require string literals arguments to enable inference.

```js
// OK
list.concat('zing', 'foo');

// ERROR
list.concat(['zing', 'foo']);
```

### filter / map / reduce and other array methods

The results of those methods will result in type loose `string[]` or returned `U[]` for map / reduce.

### References

See the global namespace `isl.doc` for information about the array overloads.

```js
namespace doc {
  type MutableMethodOmited =
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

  type ImplementedForReadOnly =
    | 'concat'
    | 'withPrefix'
    | 'withSuffix'
    | 'toReversed'
    | 'toSorted';

  type SupportedMethodWithTypeFix =
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
    | 'filter';

  type SupportedMethodWithNativeType =
    | 'map'
    | 'reduce'
    | 'reduceRight'
    | 'flat'
    | 'flatMap';

  type SupportedNativeMethod =
    | 'join'
    | 'toLocaleString'
    | 'toString'
    | 'entries'
    | 'keys'
    | 'values'
    | 'forEach';
}
```
