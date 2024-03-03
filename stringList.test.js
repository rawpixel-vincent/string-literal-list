import t from 'tap';

import {
  StringLiteralList,
  ARRAY_IN_PLACE_MUTATION,
} from './StringLiteralList.js';

import { stringList } from './stringList.js';

/**
 * @template {string} TS
 * @template {import('./StringLiteralList.js').IStringList<TS>} T
 * @param {import('tap').Test} st
 * @param {T} list
 * @param {...TS} values
 */
const testExpectedArrayValues = (st, list, ...values) => {
  st.ok(list.constructor.name === 'StringLiteralList');
  st.notOk(list.constructor.name === 'Array');
  st.match(list, new StringLiteralList(...values));
  st.match(list, {
    length: values.length,
  });
  st.match([...list], values);
  st.match([...list.keys()], [...values.keys()]);
  st.match([...list.values()], values);
  st.match([...list.entries()], [...values.entries()]);
  for (const [i, value] of list.entries()) {
    st.match(value, values[i]);
    st.ok(list.includes(value));
    st.ok(list.indexOf(values[i]) === i);
    st.ok(list.at(i) === value);
    st.ok(list.findLastIndex((v) => v === value) === i);
    st.ok(list.findIndex((v) => v === value) === i);
    st.ok(list.some((v) => v === value) === true);
    st.ok(list.every((v) => v === value) === (list.length === 1));
  }

  st.notOk(list.includes(null));
  st.ok(list.at(values.length) === undefined);
};

/**
 * @template {string} TS
 * @template {import('./StringLiteralList.js').IStringList<TS>} T
 * @param {import('tap').Test} st
 * @param {T} list
 * @param {...TS} values
 */
const testEscapingFromStringList = (st, list, ...values) => {
  st.ok(list.constructor.name === 'StringLiteralList');

  // map()
  const fromMap = list.map((el) => el);
  st.ok(fromMap.constructor.name === 'Array');
  st.ok(fromMap.length === list.length);
  st.match(fromMap, list);
  if (values.length > 0) {
    list.map((e) => e.toUpperCase()).includes(values[0].toUpperCase());
  }

  // filter()
  const fromFilter = list.filter(() => true);
  st.ok(fromFilter.constructor.name === 'Array');
  st.ok(fromFilter.length === list.length);
  st.match(fromFilter, list);

  // reduce()
  const fromReduce = list.reduce((acc, el) => acc.concat(el), []);
  st.ok(fromReduce.constructor.name === 'Array');
  st.ok(fromReduce.length === list.length);
  st.match(fromReduce, list);

  // reduceRight()
  const fromReduceRight = list.reduceRight((acc, el) => acc.concat(el), []);
  st.ok(fromReduceRight.constructor.name === 'Array');
  st.ok(fromReduceRight.length === list.length);
  st.match(fromReduceRight.reverse(), list);

  // flat()
  const fromFlat = list.flat();
  st.ok(fromFlat.constructor.name === 'Array');
  st.ok(fromFlat.length === list.length);
  st.match(fromFlat, list);

  // flatMap()
  const fromFlatMap = list.flatMap((el) => [el]);
  st.ok(fromFlatMap.constructor.name === 'Array');
  st.ok(fromFlatMap.length === list.length);
  st.match(fromFlatMap, list);

  // toSpliced()
  const fromSpliced = list.toSpliced(0, 0);
  st.ok(fromSpliced.constructor.name === 'Array');
  st.ok(fromSpliced.length === list.length);
  st.match(fromSpliced, list);
};

t.test('empty stringList', (t) => {
  const list = stringList();
  t.match([...list], []);
  testExpectedArrayValues(t, list);
  testEscapingFromStringList(t, list);
  t.end();
});

t.test("stringList('foo')", (t) => {
  const list = stringList('foo');
  testExpectedArrayValues(t, list, 'foo');
  testEscapingFromStringList(t, list, 'foo');
  t.end();
});

t.test("stringList('foo', 'bar')", (t) => {
  const list = stringList('foo', 'bar');
  testExpectedArrayValues(t, list, 'foo', 'bar');
  testEscapingFromStringList(t, list, 'foo', 'bar');
  t.end();
});

t.test("withPrefix('prefix.')", (t) => {
  const list = stringList('foo', 'bar').withPrefix('prefix.');
  testExpectedArrayValues(t, list, 'prefix.foo', 'prefix.bar');
  testEscapingFromStringList(t, list, 'prefix.foo', 'prefix.bar');
  t.end();
});

t.test("withSuffix('.suffix')", (t) => {
  const list = stringList('foo', 'bar').withSuffix('.suffix');
  testExpectedArrayValues(t, list, 'foo.suffix', 'bar.suffix');
  testEscapingFromStringList(t, list, 'foo.suffix', 'bar.suffix');
  t.end();
});

t.test("concat('zing', 'boom')", (t) => {
  const list = stringList('foo', 'bar').concat('zing', 'boom');
  testExpectedArrayValues(t, list, 'foo', 'bar', 'zing', 'boom');
  testEscapingFromStringList(t, list, 'foo', 'bar', 'zing', 'boom');
  t.end();
});

t.test('toSorted()', (t) => {
  const list = stringList('foo', 'bar').toSorted();
  testExpectedArrayValues(t, list, 'bar', 'foo');
  testEscapingFromStringList(t, list, 'bar', 'foo');
  t.end();
});

t.test('toReversed()', (t) => {
  const list = stringList('foo', 'bar').toReversed();
  testExpectedArrayValues(t, list, 'bar', 'foo');
  testEscapingFromStringList(t, list, 'bar', 'foo');
  t.end();
});

t.test('all chained', (t) => {
  const list = stringList('foo', 'bar')
    .concat('doink', 'bleep')
    .withPrefix('prefix.')
    .withSuffix('.suffix')
    .toSorted()
    .toReversed();
  testExpectedArrayValues(
    t,
    list,
    'prefix.foo.suffix',
    'prefix.doink.suffix',
    'prefix.bleep.suffix',
    'prefix.bar.suffix',
  );
  testEscapingFromStringList(
    t,
    list,
    'prefix.foo.suffix',
    'prefix.doink.suffix',
    'prefix.bleep.suffix',
    'prefix.bar.suffix',
  );
  t.end();
});

t.test('stringList(invalid arguments) throws', (t) => {
  t.throws(
    // @ts-expect-error[incompatible-call]
    () => stringList(4, 'foo'),
    new Error('Not a string in stringList 4'),
  );

  t.end();
});

t.test('stringList mutable', (t) => {
  const list = stringList('foo');
  Object.values(ARRAY_IN_PLACE_MUTATION).forEach((el) => {
    t.throws(
      () =>
        // @ts-expect-error
        list[el](),
      new Error(`Array method ${el} is not supported by StringLiteralList`),
    );
    // @ts-expect-error
    t.ok(list.mutable()[el]());
  });
  t.end();
});
