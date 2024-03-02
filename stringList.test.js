import stringList from './index.js';

let d = stringList('foo', 'bar');
if (d[0] !== 'foo') {
  throw new Error('d[0] !== "foo"');
}
if (d[1] !== 'bar') {
  throw new Error('d[1] !== "bar"');
}
if (d.length !== 2) {
  throw new Error('d.length !== 2');
}

if (!d.includes('foo')) {
  throw new Error('d.includes() failed');
}
if (!d.includes('bar')) {
  throw new Error('d.includes() failed');
}
if (d.includes('')) {
  throw new Error(`d.includes('') failed`);
}

let b = d.withPrefix('prefix.');
if (b[0] !== 'prefix.foo') {
  throw new Error('d.withPrefix() failed');
}
if (b[1] !== 'prefix.bar') {
  throw new Error('d.withPrefix() failed');
}
if (b.length !== 2) {
  throw new Error('d.withPrefix().length failed');
}
if (b.includes('bar') || b.includes('foo')) {
  throw new Error('d.withPrefix().includes failed');
}

let c = d.withSuffix('.suffix');
if (c[0] !== 'foo.suffix') {
  throw new Error('d.withSuffix() failed');
}
if (c[1] !== 'bar.suffix') {
  throw new Error('d.withSuffix() failed');
}
if (c.length !== 2) {
  throw new Error('d.withSuffix().length failed');
}
if (c.includes('bar') || c.includes('foo')) {
  throw new Error('d.withSuffix().includes failed');
}

let a = d.concat(
  ...b,
  ...c,
  ...stringList('foo', 'bar').withPrefix('prefix.').withSuffix('.suffix'),
);
if (a[0] !== 'foo') {
  throw new Error('StringList.concat() failed a[0]');
}
if (a[1] !== 'bar') {
  throw new Error('StringList.concat() failed a[1]');
}
if (a[2] !== 'prefix.foo') {
  throw new Error('StringList.concat() failed a[2]');
}
if (a[3] !== 'prefix.bar') {
  throw new Error('StringList.concat() failed a[3]');
}
if (a[4] !== 'foo.suffix') {
  throw new Error('StringList.concat() failed a[4]');
}
if (a[5] !== 'bar.suffix') {
  throw new Error('StringList.concat() failed a[5]');
}
if (a[6] !== 'prefix.foo.suffix') {
  throw new Error('StringList.concat() failed a[6]');
}
if (a[7] !== 'prefix.bar.suffix') {
  throw new Error('StringList.concat() failed a[7]');
}
if (a.length !== 8) {
  throw new Error('StringList.concat() failed');
}
if (a.includes('')) {
  throw new Error('StringList.concat() failed');
}
const value = globalThis?.thing || {};
if (a.includes(value)) {
  throw new Error('StringList.includes(any) failed');
}

globalThis.thing = 'bar';
if (!a.includes(globalThis.thing)) {
  throw new Error('StringList.includes(any) failed');
}

let thrown = false;
try {
  stringList(
    // @ts-expect-error[2345]
    Object.fromEntries([['invalid', 'values']]),
    'followed',
    'by',
    undefined,
    { type: 'of' },
    Array('stuff'),
  );
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('stringList(...invalidValues) failed to throw an error');
}
thrown = false;
try {
  stringList(
    'valid',
    // @ts-expect-error[2345]
    'followed',
    'by',
    undefined,
    { type: 'of' },
    Array('stuff'),
  );
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error(
    'stringList(...validValues, 1 invalid) failed to throw an error',
  );
}
thrown = false;

try {
  // @ts-expect-error
  a.push('');
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.push("") failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.pop();
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.pop() failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.reverse();
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.reverse() failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.shift();
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.shift() failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.unshift('d');
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.unshift() failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.fill('');
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.fill() failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.splice(0, 1);
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.splice() failed');
}
thrown = false;

try {
  // @ts-expect-error
  const d = a.slice();
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.slice() failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.sort();
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.sort() failed');
}
thrown = false;

try {
  // @ts-expect-error
  a[0] = '';
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a[] = failed');
}
thrown = false;

try {
  // @ts-expect-error
  a.copyWithin(1, 1);
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.copyWithin failed');
}

const arr = a.mutable();
try {
  // @ts-expect-error
  a.push('addFailed');
} catch (error) {
  thrown = true;
}
if (!thrown) {
  throw new Error('a.push() failed');
}
thrown = false;

arr.push('success');
if (arr.pop() !== 'success') {
  throw new Error('arr.pop() failed');
}
const val = arr.splice(0, 1);
if (val.length !== 1 || val[0] !== 'foo') {
  throw new Error('arr.splice failed');
}
if (arr.reverse().pop() !== 'bar') {
  throw new Error('arr.reverse.pop failed');
}

a.includes('asda');
a.lastIndexOf(['asda']);
let bb = 'asdasg';
let bbb = 1;
a.find((x) => x === bb);
a.findIndex((x) => x === bb);
a.some((x) => x === bb);
a.every((x) => x === bb);

// @ts-expect-error
a.find((x) => x === 'asdasd');
// @ts-expect-error
a.findIndex((x) => x === 'asdasdas');
// @ts-expect-error
a.some((x) => x === 'asdasdd');
// @ts-expect-error
a.every((x) => x === 'afgsa');

const af = a.filter((x) => x === 'foo');
const b2 = a.map((x) => `prefix.${x}`);
const c2 = a.map((x) => `${x}.suffix`);
const aR = a.toReversed();
if (a.filter((x) => aR.includes(x)).length !== a.length) {
  throw new Error('a.filter returned true');
}
const aS = a.toSorted();
if (a.length !== aS.length) {
  throw new Error('a.toSorted() length does not match a.length');
}
const aa = stringList(...a);
if (
  a.filter(
    (x, i) =>
      aa.includes(x) &&
      aa.find((xx) => xx === x) &&
      aa.some((xx) => xx === x) &&
      aa.findIndex((xx) => xx === x) >= 0 &&
      aa.lastIndexOf(x) >= 0,
  ).length !== a.length
) {
  throw new Error(
    'a copy filtered with aa.includes aa.findIndex aa.lastIndexOf should match the original list length',
  );
}

const aConcat = a.concat('foo');
const aRC = aConcat.toReversed();
if (!aRC.includes('foo')) {
  throw new Error('a.toReversed().includes("foo")');
}
if (a.length + 1 !== aRC.length || aRC.length !== aConcat.length) {
  throw new Error(`a.length + 1 !== a.concat('item') || toReversed().length`);
}

// @ts-expect-error
a.concat(['a']);
// @ts-expect-error
a.concat(1);

if (
  JSON.stringify(
    stringList(
      'foo',
      'bar',
      'prefix.foo',
      'prefix.bar',
      'foo.suffix',
      'bar.suffix',
      'prefix.foo.suffix',
      'prefix.bar.suffix',
    ).mutable(),
  ) !==
  JSON.stringify([
    'foo',
    'bar',
    'prefix.foo',
    'prefix.bar',
    'foo.suffix',
    'bar.suffix',
    'prefix.foo.suffix',
    'prefix.bar.suffix',
  ])
) {
  throw new Error('a.mutable() failed');
}

console.log('Test passed');
