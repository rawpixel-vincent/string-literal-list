'use strict';
import t from 'tap';

import { ARRAY_IN_PLACE_MUTATION, SL } from './StringLiteralList.js';

import { stringList as immutableStringList } from './strict.js';
import { stringList as mutableStringList } from './stringList.js';

const functions = [
  {
    type: 'immutable',
    stringList: immutableStringList,
  },
  {
    type: 'mutable',
    stringList: mutableStringList,
  },
];

for (const { type, stringList } of functions) {
  /**
   * @param {import('tap').Test} st
   * @param {any} list
   * @param {...string} values
   */
  const testExpectedArrayValues = (st, list, ...values) => {
    st.ok(list.constructor.name === 'SL');
    st.notOk(list.constructor.name === 'Array');
    st.match(list, new SL(...values));
    st.match(list, {
      length: values.length,
    });
    st.match([...list], values);
    st.match(JSON.stringify([...list]), JSON.stringify(values));
    st.match([...list.keys()], [...values.keys()]);
    st.match([...list.values()], values);
    st.match([...list.entries()], [...values.entries()]);
    for (const [i, value] of list.entries()) {
      st.match(value, values[i]);
      st.match(list.enum[value], value);
      st.ok(list.includes(value));
      st.ok(list.indexOf(values[i]) === i);
      st.ok(list.at(i) === value);
      if (Array.prototype.findLastIndex) {
        st.ok(list.findLastIndex((v) => v === value) === i);
      }
      st.ok(list.findIndex((v) => v === value) === i);
      st.ok(list.some((v) => v === value) === true);
      st.ok(list.every((v) => v === value) === (list.length === 1));
      st.ok(list.value(value) === value);
    }

    st.ok(list.enum[`${Math.random() * 100000}!`] === undefined);
    st.ok(list.enum[Math.random() * 100000] === undefined);
    st.throws(() => list.value(`${Math.random() * 100000}`));

    st.notOk(list.includes(null));
    st.ok(list.at(values.length) === undefined);
  };

  /**
   * @param {import('tap').Test} st
   * @param {any} list
   * @param {...string} values
   */
  const testEscapingFromStringList = (st, list, ...values) => {
    st.ok(list.constructor.name === 'SL');

    // map()
    const fromMap = list.map((el) => el);
    st.ok(fromMap.constructor.name === 'Array');
    st.ok(fromMap.length === list.length);
    st.match(fromMap, list);
    st.match(JSON.stringify([...list]), JSON.stringify(fromMap));
    if (values.length > 0) {
      list
        .map((e) => typeof e === 'string' && e.toUpperCase())
        .includes(values[0].toUpperCase());
    }

    // filter()
    const fromFilter = list.filter(() => true);
    st.ok(fromFilter.constructor.name === 'Array');
    st.ok(fromFilter.length === list.length);
    st.match(fromFilter, list);
    st.match(JSON.stringify([...list]), JSON.stringify(fromFilter));

    // reduce()
    const fromReduce = list.reduce((acc, el) => acc.concat(el), []);
    st.ok(fromReduce.constructor.name === 'Array');
    st.ok(fromReduce.length === list.length);
    st.match(fromReduce, list);
    st.match(JSON.stringify([...list]), JSON.stringify(fromReduce));

    // reduceRight()
    const fromReduceRight = list.reduceRight((acc, el) => acc.concat(el), []);
    st.ok(fromReduceRight.constructor.name === 'Array');
    st.ok(fromReduceRight.length === list.length);
    st.match(fromReduceRight.reverse(), list);
    st.match(JSON.stringify([...list]), JSON.stringify(fromReduceRight));

    // flat()
    const fromFlat = list.flat();
    st.ok(fromFlat.constructor.name === 'Array');
    st.ok(fromFlat.length === list.length);
    st.match(fromFlat, list);
    st.match(JSON.stringify([...list]), JSON.stringify(fromFlat));

    // flatMap()
    const fromFlatMap = list.flatMap((el) => [el]);
    st.ok(fromFlatMap.constructor.name === 'Array');
    st.ok(fromFlatMap.length === list.length);
    st.match(fromFlatMap, list);
    st.match(JSON.stringify([...list]), JSON.stringify(fromFlatMap));

    // toSpliced()
    const fromSpliced = list.toSpliced(0, 0);
    st.ok(fromSpliced.constructor.name === 'Array');
    st.ok(fromSpliced.length === list.length);
    st.match(fromSpliced, list);
    st.match(JSON.stringify([...list]), JSON.stringify(fromSpliced));

    // with()
    if (values.length > 0) {
      const fromWith = list.with(0, 'a');
      st.ok(fromWith.constructor.name === 'Array');
      st.ok(fromWith.length === list.length);
      st.notMatch(fromWith, list);
      st.notMatch(fromWith, values);
      st.match([...fromWith.slice(1)], values.slice(1));
      st.match(fromWith.concat(...list), fromWith);
    } else {
      if (!process.version.match(/^v1[2-8]\./)) {
        st.throws(() => list.with(0, 'a'), new Error('Invalid index : 0'));
      } else {
        st.throws(
          () => list.with(0, 'a').slice(1),
          new RangeError('Incorrect index'),
        );
      }
    }
  };

  t.test(type + ': empty stringList', (t) => {
    const list = stringList();
    t.match([...list], []);
    testExpectedArrayValues(t, list);
    testEscapingFromStringList(t, list);
    t.doesNotThrow(() => {
      t.ok(list.concat().length === 0);
      t.ok(list.withPrefix('.').length === 0);
      t.ok(list.withSuffix('.').length === 0);
      t.ok(list.toSorted().length === 0);
      t.ok(list.toReversed().length === 0);
    });
    const notEmpty = list.concat('a', 'b', 'c');
    t.ok(notEmpty.length === 3);
    t.ok(list.length === 0);
    t.notMatch(list, notEmpty);
    t.match(notEmpty, stringList('a', 'b', 'c'));

    t.end();
  });

  t.test(type + ': enum object', (t) => {
    const list = stringList('foo', 'bar');
    t.match(list.enum, {
      foo: 'foo',
      bar: 'bar',
    });

    const list2 = list.concat('doink', 'bleep');

    t.match(list.enum, {
      foo: 'foo',
      bar: 'bar',
    });

    t.match(list2.enum, {
      foo: 'foo',
      bar: 'bar',
      doink: 'doink',
      bleep: 'bleep',
    });
    t.end();
  });

  t.test(type + ": stringList('foo')", (t) => {
    const list = stringList('foo');
    testExpectedArrayValues(t, list, 'foo');
    testEscapingFromStringList(t, list, 'foo');
    t.end();
  });

  t.test(type + ": stringList('foo', 'bar')", (t) => {
    const list = stringList('foo', 'bar');
    testExpectedArrayValues(t, list, 'foo', 'bar');
    testEscapingFromStringList(t, list, 'foo', 'bar');
    t.end();
  });

  t.test(type + ": withPrefix('prefix.')", (t) => {
    const list = stringList('foo', 'bar').withPrefix('prefix.');
    testExpectedArrayValues(t, list, 'prefix.foo', 'prefix.bar');
    testEscapingFromStringList(t, list, 'prefix.foo', 'prefix.bar');
    t.end();
  });

  t.test(type + ": withDerivatedSuffix('s')", (t) => {
    const list = stringList('food', 'bars', 'pasta', 'meatballs')
      .withDerivatedSuffix('s')
      .toSorted((a, b) => a.localeCompare(b));
    testExpectedArrayValues(
      t,
      list,
      'bar',
      'bars',
      'food',
      'foods',
      'meatball',
      'meatballs',
      'pasta',
      'pastas',
    );
    testEscapingFromStringList(
      t,
      list,
      'bar',
      'bars',
      'food',
      'foods',
      'meatball',
      'meatballs',
      'pasta',
      'pastas',
    );
    t.end();
  });

  t.test(type + ": withDerivatedPrefix('#')", (t) => {
    const list = stringList('#trending', 'stuff')
      .withDerivatedPrefix('#')
      .toSorted((a, b) => a.localeCompare(b));
    testExpectedArrayValues(
      t,
      list,
      '#stuff',
      '#trending',
      'stuff',
      'trending',
    );
    testEscapingFromStringList(
      t,
      list,
      '#stuff',
      '#trending',
      'stuff',
      'trending',
    );
    t.end();
  });

  t.test(type + ": withSuffix('.suffix')", (t) => {
    const list = stringList('foo', 'bar').withSuffix('.suffix');
    testExpectedArrayValues(t, list, 'foo.suffix', 'bar.suffix');
    testEscapingFromStringList(t, list, 'foo.suffix', 'bar.suffix');
    t.end();
  });

  t.test(type + ': withReplace("1")', (t) => {
    const list = stringList('f1oo', 'b1ar').withReplace('1', '');
    testExpectedArrayValues(t, list, 'foo', 'bar');
    testEscapingFromStringList(t, list, 'foo', 'bar');
    t.end();
  });

  t.test(type + ': withReplaceAll("z")', (t) => {
    const list = stringList('foo', 'azzztiv', 'zzz', 'z1').withReplaceAll(
      'z',
      '',
    );
    testExpectedArrayValues(t, list, 'foo', 'ativ', '', '1');
    testEscapingFromStringList(t, list, 'foo', 'ativ', '', '1');
    t.end();
  });

  t.test(type + ': withTrim()', (t) => {
    const list = stringList('   foo  ', ' bar    ').withTrim();
    testExpectedArrayValues(t, list, 'foo', 'bar');
    testEscapingFromStringList(t, list, 'foo', 'bar');
    t.end();
  });

  t.test(type + ': withTrim().withReplaceAll("_")', (t) => {
    const list = stringList('has spaces ', ' has more_spaces')
      .withTrim()
      .withReplaceAll(' ', '_');
    testExpectedArrayValues(t, list, 'has_spaces', 'has_more_spaces');
    testEscapingFromStringList(t, list, 'has_spaces', 'has_more_spaces');
    t.end();
  });

  t.test(type + ': without()', (t) => {
    const list = stringList('foo', 'bar').without('bar');
    testExpectedArrayValues(t, list, 'foo');
    testEscapingFromStringList(t, list, 'foo');

    const list2 = stringList(
      'foo',
      'bar',
      'bar2',
      'foo2',
      'bar3',
      'foo3',
      'bar4',
      'foo4',
    ).without(
      stringList('bar', 'foo'),
      // @ts-expect-error (because of null/object in the parameters - added to cover the case)
      'bar2',
      stringList('bar3', 'foo3'),
      'foo4',
      null,
      { foo2: 'bar4' },
    );
    testExpectedArrayValues(t, list2, 'foo2', 'bar4');
    testEscapingFromStringList(t, list2, 'foo2', 'bar4');
    t.end();
  });

  t.test(type + ": concat('zing', 'boom')", (t) => {
    const list = stringList('foo', 'bar').concat('zing', 'boom');
    testExpectedArrayValues(t, list, 'foo', 'bar', 'zing', 'boom');
    testEscapingFromStringList(t, list, 'foo', 'bar', 'zing', 'boom');
    t.end();
  });

  t.test(type + ": concat(stringList, stringList, 'a', 'b', 'c', 'd')", (t) => {
    const a = stringList('abc', 'def', 'ghi');
    const b = stringList('jkl', 'mno', 'pqr');
    const c = stringList('stu', 'vwx', 'yz');
    const list = a.concat(b, c, 'a', 'b', 'c', 'd');
    testExpectedArrayValues(
      t,
      list,
      'abc',
      'def',
      'ghi',
      'jkl',
      'mno',
      'pqr',
      'stu',
      'vwx',
      'yz',
      'a',
      'b',
      'c',
      'd',
    );
    testEscapingFromStringList(
      t,
      list,
      'abc',
      'def',
      'ghi',
      'jkl',
      'mno',
      'pqr',
      'stu',
      'vwx',
      'yz',
      'a',
      'b',
      'c',
      'd',
    );
    t.end();
  });

  t.test(type + ': toSorted()', (t) => {
    const list = stringList('foo', 'bar').toSorted();
    testExpectedArrayValues(t, list, 'bar', 'foo');
    testEscapingFromStringList(t, list, 'bar', 'foo');
    t.end();
  });

  t.test(type + ': toReversed()', (t) => {
    const list = stringList('foo', 'bar').toReversed();
    testExpectedArrayValues(t, list, 'bar', 'foo');
    testEscapingFromStringList(t, list, 'bar', 'foo');
    t.end();
  });

  t.test(type + ': slice()', (t) => {
    const list = stringList('foo', 'bar', 'baz').slice(1, 3);
    testExpectedArrayValues(t, list, 'bar', 'baz');
    testEscapingFromStringList(t, list, 'bar', 'baz');
    t.end();
  });

  t.test(type + ': all chained', (t) => {
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

  t.test(type + ': stringList(invalid arguments) throws', (t) => {
    t.doesNotThrow(() => stringList(4, 'foo', ['d', 45], undefined));

    t.end();
  });

  Object.values(ARRAY_IN_PLACE_MUTATION).forEach((el) => {
    t.test(type + `: stringList calling function list.${el}()`, (t) => {
      const list = stringList('foo', 'bar');
      if (el !== 'pop') {
        t.end();
        return;
      }
      if (type === 'immutable') {
        t.throws(
          () =>
            // @ts-expect-error
            list[el](0, 0),
          `foo'.${el} should throw in ${type} mode`,
        );
      } else {
        t.doesNotThrow(
          () =>
            // @ts-expect-error
            list[el](0, 0),
          `foo'.${el} should fail`,
        );
      }
      t.ok(
        typeof list.mutable()[el] === 'function',
        `Expected list.mutable().${el} to exists.`,
      );
      t.ok(
        // @ts-expect-error
        typeof list.mutable()[el](0, 0) !== 'undefined',
        `Expected list.mutable().${el} to exists and return something.`,
      );
      t.end();
    });
  });

  t.test(type + ': search methods', (t) => {
    const values = 'abcdefghij'.split('');
    const list = stringList('foo', 'bar', 'baz')
      .withPrefix('a.')
      .withSuffix('.z');

    t.ok(!list.includes('bar'));
    t.ok(!list.includes(values[1]));
    t.ok(!list.includes(null));
    t.ok(!list.includes(undefined));
    t.ok(!list.includes(0));
    t.ok(!list.includes(/foo/i));
    t.ok(!list.some((el) => el === values[1]));
    t.ok(!list.some((el) => el === null));
    t.ok(!list.some((el) => el === undefined));
    // @ts-expect-error
    t.ok(!list.some((el) => el === 0));
    t.ok(list.indexOf('bar') === -1);
    t.ok(list.indexOf(null) === -1);
    t.ok(list.indexOf(undefined) === -1);
    t.ok(list.indexOf(values[1]) === -1);
    t.ok(!list.every((el) => el === values[1]));
    t.ok(!list.every((e) => e === null));
    t.ok(!list.every((e) => e === undefined));
    // @ts-expect-error
    t.ok(!list.every((e) => e === 0));
    t.ok(!list.find((el) => el === values[1]));
    t.ok(!list.find((el) => el === null));
    t.ok(!list.find((el) => el === undefined));
    // @ts-expect-error
    t.ok(!list.find((el) => el === 0));
    t.ok(list.findIndex((el) => el === values[1]) === -1);
    t.ok(list.findIndex((el) => el === null) === -1);
    t.ok(list.findIndex((el) => el === undefined) === -1);
    // @ts-expect-error
    t.ok(list.findIndex((el) => el === 0) === -1);

    t.end();
  });
}
