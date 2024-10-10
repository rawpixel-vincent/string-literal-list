/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/* eslint-disable no-unused-vars */

import 'core-js/actual/array/to-reversed.js';
import 'core-js/actual/array/to-sorted.js';
import 'core-js/actual/array/to-spliced.js';
import 'core-js/actual/array/find-last-index.js';
import 'core-js/actual/array/flat.js';
import 'core-js/actual/array/find-last.js';
import 'core-js/actual/array/flat-map.js';
import 'core-js/actual/array/last-index-of.js';
import 'core-js/actual/array/with.js';
import mt from 'tap';

import { ARRAY_IN_PLACE_MUTATION, SL } from './StringLiteralList.js';
import { stringList as mutableStringList, sl } from './stringList.js';

import { stringList as immutableStringList } from './strict.js';

import mutableMin from './stringList.min.js';

import strictMin from './strict.min.js';

/** @type {typeof import('./stringList.js')['sl']} */
// @ts-expect-error
const mutableMinStringListCjs = mutableMin.stringList;
/** @type {typeof import('./strict.js')['sl']} */
// @ts-expect-error
const strictMinStringListCjs = strictMin.stringList;

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
/** @type {typeof import('./stringList.js')['sl']} */
const mutableStringListCjs = require('./' + 'stringList.cjs').stringList;
/** @type {typeof import('./strict.js')['sl']} */
const immutableStringListCjs = require('./' + 'strict.cjs').stringList;

/**
 * @type {{type:string, stringList:typeof import('./stringList.js').stringList}[]}
 */
const functions = [
  {
    type: 'mutable',
    stringList: mutableStringList,
  },
  {
    type: 'immutable',
    stringList: immutableStringList,
  },
  {
    type: 'mutableCjs',
    stringList: mutableStringListCjs,
  },
  {
    type: 'immutableCjs',
    stringList: immutableStringListCjs,
  },
  {
    type: 'mutableMin',
    stringList: mutableMinStringListCjs,
  },
  {
    type: 'immutableMin',
    stringList: strictMinStringListCjs,
  },
];

for (const { type, stringList } of functions) {
  await mt.test(type, async (tt) => {
    let constructorName = stringList().constructor.name;
    /**
     * @param {import('tap').Test} st
     * @param {any} list
     * @param {string[]} values
     */
    const testExpectedArrayValues = (st, list, ...values) => {
      st.ok(list.constructor.name === constructorName);
      st.notOk(list.constructor.name === Array.name);
      st.match(list, new SL(...values));
      st.match(list, {
        length: values.length,
      });
      st.match([...list], values);
      st.match(JSON.stringify([...list]), JSON.stringify(values));
      st.match([...list].toString(), list.toString());
      st.match([...list.keys()], [...values.keys()]);
      st.match([...list.values()], values);
      st.match([...list.entries()], [...values.entries()]);
      for (const [i, value] of list.entries()) {
        st.match(value, values[i]);
        st.match(list.enum[value], value);
        st.ok(list.includes(value));
        st.ok(list.includes(value, i));
        st.ok(list.indexOf(values[i]) !== -1);
        st.ok(list.at(i) === value);

        st.ok(list.findLastIndex((v) => v === value) !== -1);

        st.ok(list.filter((v, vi) => v === value && vi === i).length === 1);
        st.ok(list.some((v) => v === value) === true);
        st.ok(
          list.every((v) => v === value) ===
            (list.filter((v) => v !== value).length === 0),
        );
        st.ok(list.value(value) === value);
      }

      st.ok(list.enum[`${Math.random() * 100000}!`] === undefined);
      st.ok(list.enum[Math.random() * 100000] === undefined);
      st.throws(() => list.value(`${Math.random() * 100000}`));
      st.throws(() => list.value(null));

      st.notOk(list.includes(null));
      st.ok(list.at(values.length) === undefined);
    };

    /**
     * @param {import('tap').Test} st
     * @param {any} list
     * @param {...string} values
     */
    const testEscapingFromStringList = (st, list, ...values) => {
      st.ok(list.constructor.name === constructorName);

      // map()
      const fromMap = list.map((el) => el);
      st.ok(fromMap.constructor.name === Array.name);
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
      st.ok(fromFilter.constructor.name === Array.name);
      st.ok(fromFilter.length === list.length);
      st.match(fromFilter, list);
      st.match(JSON.stringify([...list]), JSON.stringify(fromFilter));

      // reduce()
      const fromReduce = list.reduce((acc, el) => acc.concat(el), []);
      st.ok(fromReduce.constructor.name === Array.name);
      st.ok(fromReduce.length === list.length);
      st.match(fromReduce, list);
      st.match(JSON.stringify([...list]), JSON.stringify(fromReduce));

      // reduceRight()
      const fromReduceRight = list.reduceRight((acc, el) => acc.concat(el), []);
      st.ok(fromReduceRight.constructor.name === Array.name);
      st.ok(fromReduceRight.length === list.length);
      st.match(fromReduceRight.reverse(), list);
      st.match(JSON.stringify([...list]), JSON.stringify(fromReduceRight));

      // flat()
      const fromFlat = list.flat();
      st.ok(fromFlat.constructor.name === Array.name);
      st.ok(fromFlat.length === list.length);
      st.match(fromFlat, list);
      st.match(JSON.stringify([...list]), JSON.stringify(fromFlat));

      // flatMap()
      const fromFlatMap = list.flatMap((el) => [el]);
      st.ok(fromFlatMap.constructor.name === Array.name);
      st.ok(fromFlatMap.length === list.length);
      st.match(fromFlatMap, list);
      st.match(JSON.stringify([...list]), JSON.stringify(fromFlatMap));

      // with()
      if (values.length > 0) {
        const fromWith = list.with(0, '__NEVER_USE_%');
        st.ok(fromWith.constructor.name === Array.name);
        st.ok(fromWith.length === list.length);
        st.notMatch(fromWith, list);
        st.notMatch(fromWith, values);
        st.match([...fromWith.slice(1)], values.slice(1));
        st.match(fromWith.concat(...list), fromWith);
      } else {
        if (!process.version.match(/^v1[2-8]\./)) {
          st.throws(
            () => list.with(0, '__NEVER_USE_%'),
            new Error('Invalid index : 0'),
          );
        } else {
          st.throws(
            () => list.with(0, '__NEVER_USE_%').slice(1),
            new RangeError('Incorrect index'),
          );
        }
      }
    };

    tt.test(type + ': empty stringList', (t) => {
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

      const notEmpty = list.concat('a', 'b', 'c').concat('c', 'b', 'a');
      t.ok(notEmpty.length === 6);
      t.ok(list.length === 0);
      t.notMatch(list, notEmpty);
      t.match(notEmpty, stringList('a', 'b', 'c', 'c', 'b', 'a'));

      /** @type {'a::b::c::c::b::a'} */
      const d = notEmpty.join('::');
      t.match(d, 'a::b::c::c::b::a');

      const list2 = notEmpty.without('a').concatList(stringList('c', 'a', 'b'));

      /** @type {'b::c::c::b::c::a::b'} */
      const d2 = list2.join('::');
      t.match(d2, 'b::c::c::b::c::a::b');
      t.match(d2, ['b', 'c', 'c', 'b', 'c', 'a', 'b'].join('::'));

      t.end();
    });

    tt.test(type + ': enum object', (t) => {
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

    tt.test(type + ": stringList('foo')", (t) => {
      const list = stringList('foo');
      testExpectedArrayValues(t, list, 'foo');
      testEscapingFromStringList(t, list, 'foo');

      const list2 = stringList('foo', 'bar');
      testExpectedArrayValues(t, list2, 'foo', 'bar');
      testEscapingFromStringList(t, list2, 'foo', 'bar');

      /** @type {'foo::bar'} */
      const d = list2.join('::');
      t.match(d, 'foo::bar');

      t.end();
    });

    tt.test(type + ": withPrefix('prefix.')", (t) => {
      const list = stringList('foo', 'bar').withPrefix('prefix.');
      testExpectedArrayValues(t, list, 'prefix.foo', 'prefix.bar');
      testEscapingFromStringList(t, list, 'prefix.foo', 'prefix.bar');

      /** @type {'prefix.foo::prefix.bar'} */
      const d = list.join('::');
      t.match(d, 'prefix.foo::prefix.bar');

      const list2 = stringList().withPrefix('prefix.').withPrefix('z.');
      testExpectedArrayValues(t, list2);
      testEscapingFromStringList(t, list2);

      /** @type {''} */
      const d2 = list2.join('::');
      t.match(d2, '');

      const list3 = stringList()
        .withPrefix('prefix.')
        .concat('a')
        .withPrefix('z.');
      testExpectedArrayValues(t, list3, 'z.a');
      testEscapingFromStringList(t, list3, 'z.a');

      /** @type {'z.a'} */
      const d3 = list3.join('::');
      t.match(d3, 'z.a');

      const list4 = stringList()
        .withPrefix('prefix.')
        .concat('b')
        .withPrefix('z.')
        .without('z.b')
        .withPrefix('z.');
      testExpectedArrayValues(t, list4);
      testEscapingFromStringList(t, list4);

      /** @type {''} */
      const d4 = list4.join('::');
      t.match(d4, '');

      t.end();
    });

    tt.test(type + ": withSuffix('.suffix')", (t) => {
      const list = stringList('foo', 'bar').withSuffix('.suffix');
      testExpectedArrayValues(t, list, 'foo.suffix', 'bar.suffix');
      testEscapingFromStringList(t, list, 'foo.suffix', 'bar.suffix');

      /** @type {'foo.suffix::bar.suffix'} */
      const d = list.join('::');
      t.match(d, 'foo.suffix::bar.suffix');

      const list2 = stringList().withSuffix('.suffix').withSuffix('.z');
      testExpectedArrayValues(t, list2);
      testEscapingFromStringList(t, list2);

      /** @type {''} */
      const d2 = list2.join('::');
      t.match(d2, '');

      const list3 = stringList()
        .withSuffix('.suffix')
        .concat('a')
        .withSuffix('.z');
      testExpectedArrayValues(t, list3, 'a.z');
      testEscapingFromStringList(t, list3, 'a.z');

      /** @type {'a.z'} */
      const d3 = list3.join('::');
      t.match(d3, 'a.z');

      const list4 = stringList()
        .withSuffix('prefix.')
        .concat('b')
        .withSuffix('.z')
        .without('b.z')
        .withSuffix('.z');
      testExpectedArrayValues(t, list4);
      testEscapingFromStringList(t, list4);

      /** @type {''} */
      const d4 = list4.join('::');
      t.match(d4, '');

      t.end();
    });

    // tt.test(type + ": withDerivatedSuffix('s')", (t) => {
    //   const list = stringList('food', 'bars', 'pasta', 'meatballs')
    //     .withDerivatedSuffix('s')
    //     .toSorted((a, b) => a.localeCompare(b));

    //   testExpectedArrayValues(
    //     t,
    //     list,
    //     'bar',
    //     'bars',
    //     'food',
    //     'foods',
    //     'meatball',
    //     'meatballs',
    //     'pasta',
    //     'pastas',
    //   );
    //   testEscapingFromStringList(
    //     t,
    //     list,
    //     'bar',
    //     'bars',
    //     'food',
    //     'foods',
    //     'meatball',
    //     'meatballs',
    //     'pasta',
    //     'pastas',
    //   );

    //   /** @type {'bar::bars::food::foods::meatball::meatballs::pasta::pastas'} */
    //   // @ts-expect-error - Unsorted list - infer string
    //   const d = list.join('::');
    //   t.match(d, 'bar::bars::food::foods::meatball::meatballs::pasta::pastas');

    //   t.end();
    // });

    // tt.test(type + ": withDerivatedPrefix('#')", (t) => {
    //   const list = stringList('#trending', 'stuff')
    //     .withDerivatedPrefix('#')
    //     .toSorted((a, b) => a.localeCompare(b));
    //   testExpectedArrayValues(
    //     t,
    //     list,
    //     '#stuff',
    //     '#trending',
    //     'stuff',
    //     'trending',
    //   );
    //   testEscapingFromStringList(
    //     t,
    //     list,
    //     '#stuff',
    //     '#trending',
    //     'stuff',
    //     'trending',
    //   );

    //   /** @type {'#stuff::#trending::stuff::trending'} */
    //   // @ts-expect-error - Unsorted list - infer string
    //   const d = list.join('::');
    //   t.match(d, '#stuff::#trending::stuff::trending');

    //   t.end();
    // });

    tt.test(type + ': withReplace("1")', (t) => {
      const list = stringList('f1oo', 'b1ar').withReplace('1', '');
      testExpectedArrayValues(t, list, 'foo', 'bar');
      testEscapingFromStringList(t, list, 'foo', 'bar');

      /** @type {'foo::bar'} */
      const d = list.join('::');
      t.match(d, 'foo::bar');

      const list2 = list.withReplace('o', 'a');
      testExpectedArrayValues(t, list2, 'fao', 'bar');
      testEscapingFromStringList(t, list2, 'fao', 'bar');

      /**
       * @type {"foo::bar"}
       */
      const d2 = list.join('::');
      t.match(d2, 'foo::bar');

      const list3 = stringList('ababababa', 'babababa').withReplace('b', '');
      testExpectedArrayValues(t, list3, 'aabababa', 'abababa');
      testEscapingFromStringList(t, list3, 'aabababa', 'abababa');

      /** @type {"aabababa::abababa"} */
      const j = list3.join('::');
      t.match(j, 'aabababa::abababa');

      t.end();
    });

    tt.test(type + ': withReplaceAll("z")', (t) => {
      const list = stringList('foo', 'azzztiv', 'zzz', 'z1').withReplaceAll(
        'z',
        '',
      );
      testExpectedArrayValues(t, list, 'foo', 'ativ', '', '1');
      testEscapingFromStringList(t, list, 'foo', 'ativ', '', '1');

      /**
       * @type {'foo::ativ::::1'}
       */
      const d = list.join('::');
      t.match(d, 'foo::ativ::::1');

      /** @type {"ativ"} */
      const d2 = list.without('foo', '', '1').join('::');
      t.match(d2, 'ativ');

      /** @type {""} */
      const d22 = list.without('foo', 'ativ', '', '1').join('::');
      t.match(d22, '');

      /** @type {'zaa::ztiv::::1'} */
      const d3 = list
        .withReplaceAll('a', 'z')
        .withReplaceAll('o', 'a')
        .withReplaceAll('f', 'z')
        .join('::');
      t.match(d3, 'zaa::ztiv::::1');

      t.end();
    });

    tt.test(type + ': withTrim()', (t) => {
      const list = stringList('   foo  ', ' bar    ').withTrim();
      testExpectedArrayValues(t, list, 'foo', 'bar');
      testEscapingFromStringList(t, list, 'foo', 'bar');
      t.end();
    });

    tt.test(type + ': withTrim().withReplaceAll("_")', (t) => {
      const list = stringList(' z', 'has spaces ', ' has more_spaces')
        .withTrim()
        .withReplaceAll(' ', '_');
      testExpectedArrayValues(t, list, 'z', 'has_spaces', 'has_more_spaces');
      testEscapingFromStringList(t, list, 'z', 'has_spaces', 'has_more_spaces');

      /** @type {'z::has_spaces::has_more_spaces'} */
      const d = list.join('::');
      t.match(d, 'z::has_spaces::has_more_spaces');

      const list2 = stringList()
        .concat('  z ', 'has spaces ', ' has more  spaces  ')
        .withTrim()
        .withReplaceAll(' ', '_');
      testExpectedArrayValues(t, list2, 'z', 'has_spaces', 'has_more__spaces');
      testEscapingFromStringList(
        t,
        list2,
        'z',
        'has_spaces',
        'has_more__spaces',
      );

      /** @type {'z::has_spaces::has_more__spaces'} */
      const d2 = list2.join('::');
      t.match(d2, 'z::has_spaces::has_more__spaces');

      t.end();
    });

    tt.test(type + ': without()', (t) => {
      const l = stringList('foo', '3', 'baz').without(['foo', 3, null]);
      testExpectedArrayValues(t, l, 'baz');
      const l2 = stringList('foo', '3', 'baz').without('foo', 3, null);
      testExpectedArrayValues(t, l2, 'baz');
      const list = stringList('foo', 'bar').without('bar');
      testExpectedArrayValues(t, list, 'foo');
      testEscapingFromStringList(t, list, 'foo');

      /** @type {'foo'} */
      const d = list.join('::');
      t.match(d, 'foo');

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

      const list3 = stringList('foo2', 'bar4', 'set', 'match').without(
        stringList('match', 'set'),
        'foo2',
      );
      testExpectedArrayValues(t, list3, 'bar4');
      testEscapingFromStringList(t, list3, 'bar4');

      /** @type {'bar4'} */
      const d3 = list3.join('::');
      t.match(d3, 'bar4');

      const list4 = stringList('z', 'a', 'X', 'aa', 'b', 'c')
        .concat('d', 'e')
        .without('X', stringList('z', 'b'));
      testExpectedArrayValues(t, list4, 'a', 'aa', 'c', 'd', 'e');
      testEscapingFromStringList(t, list4, 'a', 'aa', 'c', 'd', 'e');

      /** @type {'a::aa::c::d::e'} */
      const d4 = list4.join('::');
      t.match(d4, 'a::aa::c::d::e');

      const list5 = stringList()
        .concat('n', 'ff', 'dd', 'ss')
        .without('ff')
        .without('n');

      testExpectedArrayValues(t, list5, 'dd', 'ss');
      testEscapingFromStringList(t, list5, 'dd', 'ss');

      /** @type {'dd::ss'} */
      const d5 = list5.join('::');
      t.match(d5, 'dd::ss');

      t.end();
    });

    tt.test(type + ": concat('zing', 'boom')", (t) => {
      const list = stringList('foo', 'bar').concat('zing', 'boom');
      testExpectedArrayValues(t, list, 'foo', 'bar', 'zing', 'boom');
      testEscapingFromStringList(t, list, 'foo', 'bar', 'zing', 'boom');

      /** @type {"foo::bar::zing::boom"} */
      const d = list.join('::');
      t.match(d, 'foo::bar::zing::boom');

      const list2 = list
        .concat('zing', 'foo', 'du')
        .concatList(stringList('doink', 'bleep'));

      /** @type {'foo::bar::zing::boom::zing::foo::du::doink::bleep'} */
      const d2 = list2.join('::');
      t.match(d2, 'foo::bar::zing::boom::zing::foo::du::doink::bleep');

      t.end();
    });

    tt.test(
      type + ": concat(stringList, stringList, 'a', 'b', 'c', 'd')",
      (t) => {
        const a = stringList('abc', 'def', 'ghi');
        const b = stringList('jkl', 'mno', 'pqr');
        const c = stringList('stu', 'vwx', 'yz');
        const list = a.concatList(b).concatList(c).concat('a', 'b', 'c', 'd');
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

        /** @type {'abc::def::ghi::jkl::mno::pqr::stu::vwx::yz::a::b::c::d'} */
        const d = list.join('::');
        t.match(d, 'abc::def::ghi::jkl::mno::pqr::stu::vwx::yz::a::b::c::d');

        t.end();
      },
    );

    tt.test(type + ': toSorted()', (t) => {
      const list = stringList('foo', 'bar').toSorted();
      testExpectedArrayValues(t, list, 'bar', 'foo');
      testEscapingFromStringList(t, list, 'bar', 'foo');

      /** @type {'bar::foo'} */
      // @ts-expect-error - Unsorted list - toSorted not supported
      const d = list.join('::');
      t.match(d, 'bar::foo');

      t.end();
    });

    tt.test(type + ': toReversed()', (t) => {
      const lista = stringList('foo', 'bar');
      const list = lista.toReversed();
      testExpectedArrayValues(t, list, 'bar', 'foo');
      testExpectedArrayValues(t, lista, 'foo', 'bar');
      testEscapingFromStringList(t, list, 'bar', 'foo');
      testEscapingFromStringList(t, lista, 'foo', 'bar');

      /** @type {'bar::foo'} */
      const d = list.join('::');
      t.match(d, 'bar::foo');
      /** @type {'foo::bar'} */
      const da = lista.join('::');
      t.match(da, 'foo::bar');

      const list2 = list.concat('doink', 'bleep').toReversed();
      testExpectedArrayValues(t, list2, 'bleep', 'doink', 'foo', 'bar');
      testEscapingFromStringList(t, list2, 'bleep', 'doink', 'foo', 'bar');

      /** @type {'bleep::doink::foo::bar'} */
      const d2 = list2.join('::');
      t.match(d2, 'bleep::doink::foo::bar');

      t.end();
    });

    tt.test(type + ': reverse()', (t) => {
      if (
        type === 'immutable' ||
        type === 'immutableCjs' ||
        type === 'immutableMin'
      ) {
        t.throws(() => {
          stringList('foo', 'bar').reverse();
        });
      } else {
        const lista = stringList('foo', '', 'bar');
        const list = lista.reverse();
        testExpectedArrayValues(t, list, 'bar', '', 'foo');
        testExpectedArrayValues(t, lista, 'bar', '', 'foo');
        testEscapingFromStringList(t, list, 'bar', '', 'foo');
        testEscapingFromStringList(t, lista, 'bar', '', 'foo');

        /** @type {'bar::::foo'} */
        const d = list.join('::');
        t.match(d, 'bar::::foo');
        /** @type {'bar::::foo'} */
        const da = lista.join('::');
        t.match(da, 'bar::::foo');

        const list2 = stringList('foo', 'bar')
          .reverse()
          .concat('doink', 'bleep')
          .reverse()
          .concat('du', 'du');

        testExpectedArrayValues(
          t,
          list2,
          'bleep',
          'doink',
          'foo',
          'bar',
          'du',
          'du',
        );
        testEscapingFromStringList(
          t,
          list2,
          'bleep',
          'doink',
          'foo',
          'bar',
          'du',
          'du',
        );

        /** @type {'bleep::doink::foo::bar::du::du'} */
        const d2 = list2.join('::');
        t.match(d2, 'bleep::doink::foo::bar::du::du');
      }
      t.end();
    });

    tt.test(type + ': slice()', (t) => {
      const list = stringList('foo', 'bar', 'baz').slice(1, 3);
      testExpectedArrayValues(t, list, 'bar', 'baz');
      testExpectedArrayValues(t, list, ...['foo', 'bar', 'baz'].slice(1, 3));
      testEscapingFromStringList(t, list, 'bar', 'baz');

      /** @type {'bar::baz'} */
      const d = list.join('::');
      t.match(d, 'bar::baz');

      const list2 = stringList('foo', 'bar', 'baz').slice(0);
      testExpectedArrayValues(t, list2, 'foo', 'bar', 'baz');
      testExpectedArrayValues(t, list2, ...['foo', 'bar', 'baz'].slice(0));
      testEscapingFromStringList(t, list2, 'foo', 'bar', 'baz');

      /** @type {'foo::bar::baz'} */
      const d2 = list2.join('::');
      t.match(d2, 'foo::bar::baz');

      const list3 = stringList('foo', 'bar', 'baz').slice(0, 2);
      testExpectedArrayValues(t, list3, 'foo', 'bar');
      testExpectedArrayValues(t, list3, ...['foo', 'bar', 'baz'].slice(0, 2));
      testEscapingFromStringList(t, list3, 'foo', 'bar');

      /** @type {'foo::bar'} */
      const d3 = list3.join('::');
      t.match(d3, 'foo::bar');

      const list4 = stringList('z', 'a', 'X', 'aa', 'b').slice(1, 5);
      testExpectedArrayValues(t, list4, 'a', 'X', 'aa', 'b');
      testExpectedArrayValues(
        t,
        list4,
        ...['z', 'a', 'X', 'aa', 'b'].slice(1, 5),
      );
      testEscapingFromStringList(t, list4, 'a', 'X', 'aa', 'b');

      /** @type {'a::X::aa::b'} */
      const d4 = list4.join('::');
      t.match(d4, 'a::X::aa::b');

      const list5 = stringList('n', 'ff', 'dd', 'ss').slice(-4, -1);
      testExpectedArrayValues(t, list5, 'n', 'ff', 'dd');
      testExpectedArrayValues(
        t,
        list5,
        ...['n', 'ff', 'dd', 'ss'].slice(-4, -1),
      );
      testEscapingFromStringList(t, list5, 'n', 'ff', 'dd');

      /** @type {'n::ff::dd'} */
      const d5 = list5.join('::');
      t.match(d5, 'n::ff::dd');

      const list6 = stringList('n', 'ff', 'dd', 'ss').slice(-2, -1);
      testExpectedArrayValues(t, list6, 'dd');
      testExpectedArrayValues(
        t,
        list6,
        ...['n', 'ff', 'dd', 'ss'].slice(-2, -1),
      );
      testEscapingFromStringList(t, list6, 'dd');

      /** @type {'dd'} */
      const d6 = list6.join('::');
      t.match(d6, 'dd');

      const list7 = stringList('n', 'ff', 'dd', 'ss').slice(-1, 4);
      testExpectedArrayValues(t, list7, 'ss');
      testExpectedArrayValues(
        t,
        list7,
        ...['n', 'ff', 'dd', 'ss'].slice(-1, 4),
      );
      testEscapingFromStringList(t, list7, 'ss');

      /** @type {'ss'} */
      const d7 = list7.join('::');
      t.match(d7, 'ss');

      const list8 = stringList('n', 'ff', 'dd', 'ss').slice(-3);
      testExpectedArrayValues(t, list8, 'ff', 'dd', 'ss');
      testExpectedArrayValues(t, list8, ...['n', 'ff', 'dd', 'ss'].slice(-3));
      testEscapingFromStringList(t, list8, 'ff', 'dd', 'ss');

      /** @type {"ff::dd::ss"} */
      const d8 = list8.join('::');
      t.match(d8, 'ff::dd::ss');

      const list9 = stringList('n', 'ff', 'dd', 'ss').slice(0, -3);
      testExpectedArrayValues(t, list9, 'n');
      testExpectedArrayValues(
        t,
        list9,
        ...['n', 'ff', 'dd', 'ss'].slice(0, -3),
      );
      testEscapingFromStringList(t, list9, 'n');

      /** @type {"n"} */
      const d9 = list9.join('::');
      t.match(d9, 'n');

      t.end();
    });

    tt.test(type + ': all chained', (t) => {
      const list = stringList('foo', 'bar')
        .concat('doink', 'bleep')
        .withPrefix('prefix.')
        .withSuffix('.suffix')
        .toReversed();

      testExpectedArrayValues(
        t,
        list,
        'prefix.bleep.suffix',
        'prefix.doink.suffix',
        'prefix.bar.suffix',
        'prefix.foo.suffix',
      );
      testEscapingFromStringList(
        t,
        list,
        'prefix.bleep.suffix',
        'prefix.doink.suffix',
        'prefix.bar.suffix',
        'prefix.foo.suffix',
      );

      /** @type {"prefix.bleep.suffix::prefix.doink.suffix::prefix.bar.suffix::prefix.foo.suffix"} */
      const d = list.join('::');
      t.match(
        d,
        'prefix.bleep.suffix::prefix.doink.suffix::prefix.bar.suffix::prefix.foo.suffix',
      );

      /** @type {"prefix.bleep::prefix.doink::prefix.bar::prefix.foo"} */
      // @ts-expect-error - Unsorted list - toSorted not supported
      const d2 = list.toSorted().join('::');
      t.match(
        d2,
        'prefix.bar.suffix::prefix.bleep.suffix::prefix.doink.suffix::prefix.foo.suffix',
      );

      t.end();
    });

    tt.test(type + ': join()', (t) => {
      /**
       * Expected type
       * @type {string}
       */
      const joinUnsorted = stringList('foo', 'bar')
        .concat('doink', 'bleep')
        .withPrefix('prefix.')
        .withSuffix('.suffix')
        .toSorted()
        .toReversed()
        .join('::');

      t.match(
        joinUnsorted,
        'prefix.foo.suffix::prefix.doink.suffix::prefix.bleep.suffix::prefix.bar.suffix',
      );

      /**
       * Expected type
       * @type {'foo::bar'}
       */
      const joinSorted = stringList('foo', 'bar').join('::');
      t.match(joinSorted, 'foo::bar');

      /**
       * Expected type
       * @type {'foo::bar'}
       */
      const emptyConcat = stringList().concat('foo', 'bar').join('::');
      t.match(emptyConcat, 'foo::bar');

      /**
       * Expected type
       * @type {'data.foo::data.bar'}
       */
      const withPrefix = stringList('foo', 'bar')
        .withPrefix('data.')
        .join('::');
      t.match(withPrefix, 'data.foo::data.bar');

      /**
       * Expected type
       * @type {'foo.json::bar.json'}
       */
      const withSuffix = stringList('foo', 'bar')
        .withSuffix('.json')
        .join('::');
      t.match(withSuffix, 'foo.json::bar.json');

      /**
       * Expected type
       * @type {'data.foo.json::data.bar.json'}
       */
      const withBoth = stringList('foo', 'bar')
        .withPrefix('data.')
        .withSuffix('.json')
        .join('::');
      t.match(withBoth, 'data.foo.json::data.bar.json');

      /**
       * Expected type
       * @type {'data.foo::data.bar::foo.json::bar.json'}
       */
      const listConcat = stringList()
        .concatList(stringList('foo', 'bar').withPrefix('data.'))
        .concatList(stringList('foo', 'bar').withSuffix('.json'))
        .join('::');

      t.match(listConcat, 'data.foo::data.bar::foo.json::bar.json');

      /**
       * Expected type
       * @type {string}
       */
      const listConcatWithout = stringList()
        .concatList(stringList('foo', 'bar').withPrefix('data.'))
        .concatList(stringList('foo', 'bar').withSuffix('.json'))
        .without('data.bar', 'bar.json')
        .concat('foo', 'bar')
        .without('bar', 'foo.json')
        .join('::');
      t.match(listConcatWithout, 'data.foo::foo');

      /**
       * Expected type
       * @type {'data.foo.json::data.bar.json::foo'}
       */
      const stringsConcatWithout = stringList()
        .concat('foo', 'bar')
        .withPrefix('data.')
        .concat('foo', 'bar')
        .withSuffix('.json')
        .without('data.bar', 'bar.json')
        .concat('foo', 'bar')
        .without('bar', 'foo.json')
        .join('::');
      t.match(stringsConcatWithout, 'data.foo.json::data.bar.json::foo');

      /**
       * Expected type
       * @type {'a.z.foo::a.foo'}
       */
      const list = stringList('foo')
        .withPrefix('z.')
        .concat('foo')
        .withPrefix('a.')
        .join('::');

      t.match(list, 'a.z.foo::a.foo');

      t.end();
    });

    tt.test(type + ': stringList(invalid arguments) throws', (t) => {
      t.doesNotThrow(() => stringList(4, 'foo', ['d', 45], undefined));
      t.end();
    });

    Object.values(ARRAY_IN_PLACE_MUTATION).forEach((el) => {
      tt.test(type + `: stringList calling function list.${el}()`, (t) => {
        const list = stringList('foo', 'bar');

        if (
          type === 'immutable' ||
          type === 'immutableCjs' ||
          type === 'immutableMin'
        ) {
          t.throws(
            () =>
              // @ts-expect-error
              list[el](),
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

    tt.test(type + ': search methods', (t) => {
      const values = 'abcdefghij'.split('');
      const list = stringList('foo', 'bar', 'baz')
        .withPrefix('a.')
        .withSuffix('.z');
      t.ok(list.includes('a.foo.z'));
      t.ok([...list].includes('a.foo.z'));
      t.ok(list.includes('a.bar.z'));
      t.ok([...list].includes('a.bar.z'));
      t.ok(list.includes('a.baz.z'));
      t.ok([...list].includes('a.baz.z'));
      t.notOk(list.includes('a.foo.z', 1));
      t.notOk([...list].includes('a.foo.z', 1));
      t.notOk(list.includes('a.foo.z', 2));
      t.notOk([...list].includes('a.foo.z', 2));
      t.notOk(list.includes('a.foo.z', 3));
      t.notOk([...list].includes('a.foo.z', 3));
      t.ok(list.includes('a.foo.z', 0));
      t.ok([...list].includes('a.foo.z', 0));
      t.ok(list.includes('a.bar.z', 1));
      t.ok([...list].includes('a.bar.z', 1));
      t.ok(list.includes('a.bar.z', 0));
      t.ok([...list].includes('a.bar.z', 0));
      t.ok(list.includes('a.baz.z', -1));
      t.ok([...list].includes('a.baz.z', -1));
      t.notOk(list.includes('a.bar.z', 2));
      t.notOk([...list].includes('a.bar.z', 2));
      t.notOk(list.includes('a.foo.z', -1));
      t.notOk([...list].includes('a.foo.z', -1));
      t.notOk(list.includes('a.foo.z', -2));
      t.notOk([...list].includes('a.foo.z', -2));
      t.ok(list.includes('a.foo.z', -3));
      t.ok([...list].includes('a.foo.z', -3));
      t.ok(list.includes('a.foo.z', -4));
      t.ok([...list].includes('a.foo.z', -4));
      t.ok(list.includes('a.foo.z', -5));
      t.ok([...list].includes('a.foo.z', -5));
      t.ok(list.includes('a.bar.z', -2));
      t.ok([...list].includes('a.bar.z', -2));
      t.notOk(list.includes('a.bar.z', -1));
      t.notOk([...list].includes('a.bar.z', -1));

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

    tt.test(type + `: toRecordType()`, (t) => {
      const list = stringList('foo', 'bar', 'baz');
      /** @type {Record<'foo' | 'bar' | 'baz', any[]>|Record<typeof list['infered']['Tuple'][*], any[]>} */
      const schema = list.toRecordType('any[]', []);
      t.match(schema, {
        foo: [],
        bar: [],
        baz: [],
      });
      schema.foo = [3];
      schema.bar = ['bar'];
      schema.baz = [];
      schema.foo = [{ a: 'a' }];
      t.match(schema, {
        foo: [{ a: 'a' }],
        bar: ['bar'],
        baz: [],
      });
      // @ts-expect-error
      schema.bar = 'bar';

      /** @type {Record<'foo' | 'bar' | 'baz', string[]>|Record<typeof list['infered']['Tuple'][*], string[]>} */
      const schema2 = list.toRecordType('string[]', []);
      t.match(schema2, {
        foo: [],
        bar: [],
        baz: [],
      });
      schema2.foo = ['bar'];
      t.match(schema2, {
        foo: ['bar'],
        bar: [],
        baz: [],
      });
      // @ts-expect-error
      schema2.bar = [3];
      // @ts-expect-error
      schema2.bar = 'bar';

      /** @type {Record<'foo' | 'bar' | 'baz', string>|Record<typeof list['infered']['Tuple'][*], string>} */
      const schema3 = list.toRecordType('string', null);
      t.match(schema3, {
        foo: null,
        bar: null,
        baz: null,
      });
      schema3.foo = 'bar';
      schema3.baz = undefined;
      t.match(schema3, {
        foo: 'bar',
        bar: null,
        baz: undefined,
      });
      // @ts-expect-error
      schema3.bar = 3;
      // @ts-expect-error
      schema3.baz = [];

      const schemaBase = stringList('id', 'created', 'changed').toRecordType(
        'number',
        null,
      );
      const schemaTags = stringList(
        'keywords',
        'categories',
        'hashtags',
      ).toRecordType('string[]', []);

      const schemaAuthor = stringList('name', 'email').toRecordType(
        'string',
        null,
      );

      const entity = stringList('published', 'deleted').toRecordType(
        'boolean',
        false,
        schemaBase,
        schemaTags,
        stringList('author').toRecordValue(schemaAuthor),
      );
      t.match(entity, {
        id: null,
        created: null,
        changed: null,
        keywords: [],
        categories: [],
        hashtags: [],
        published: false,
        deleted: false,
        author: {
          name: null,
          email: null,
        },
      });
      entity.id = 3;
      entity.deleted = true;
      entity.created = 1;
      entity.changed = 2;
      entity.keywords = ['a'];
      entity.categories = ['b'];
      entity.hashtags = ['#c', '#d'];
      entity.published = true;
      entity.author.name = 'name';
      entity.author.email = 'email';
      t.match(entity, {
        id: 3,
        created: 1,
        changed: 2,
        keywords: ['a'],
        categories: ['b'],
        hashtags: ['#c', '#d'],
        published: true,
        deleted: true,
        author: {
          name: 'name',
          email: 'email',
        },
      });
      // @ts-expect-error
      entity.tags = [];
      // @ts-expect-error
      entity.id = 'id';
      // @ts-expect-error
      entity.keywords = [3];
      // @ts-expect-error
      entity.created = true;
      // @ts-expect-error
      entity.keywords = 'a';
      // @ts-expect-error
      entity.author.name = 3;
      // @ts-expect-error
      entity.author = {};
      // @ts-expect-error
      entity.author.email = { email: 'email' };
      entity.author = null;

      const schemaBASE = stringList('id', 'created', 'changed')
        .toUpperCase()
        .toRecordType('number', null);
      const schemaTAGS = stringList('keywords', 'categories', 'hashtags')
        .toUpperCase()
        .toRecordType('string[]', []);

      const schemaAUTHOR = stringList('name', 'email')
        .toUpperCase()
        .toRecordType('string', null);

      const ENTITY = stringList('published', 'deleted')
        .toUpperCase()
        .toRecordType(
          'boolean',
          false,
          schemaBASE,
          schemaTAGS,
          stringList('AUTHOR').toRecordValue(schemaAUTHOR),
        );
      t.match(ENTITY, {
        ID: null,
        CREATED: null,
        CHANGED: null,
        KEYWORDS: [],
        CATEGORIES: [],
        HASHTAGS: [],
        PUBLISHED: false,
        DELETED: false,
        AUTHOR: {
          NAME: null,
          EMAIL: null,
        },
      });

      const schemaArray = stringList('foo', 'bar', 'baz').toRecordType(
        'string[]',
        [],
      );
      t.match(schemaArray, {
        foo: [],
        bar: [],
        baz: [],
      });
      schemaArray.foo.push(3);
      schemaArray.bar.push('bar');
      schemaArray.baz.push('baz');
      t.match(schemaArray, {
        foo: [3],
        bar: ['bar'],
        baz: ['baz'],
      });

      const schemaString = stringList('foo', 'bar', 'baz').toRecordType(
        'string',
        '',
      );
      t.match(schemaString, {
        foo: '',
        bar: '',
        baz: '',
      });

      const schemaObject = stringList('foo', 'bar', 'baz').toRecordType(
        'any',
        {},
      );
      t.match(schemaObject, {
        foo: {},
        bar: {},
        baz: {},
      });
      schemaObject.foo.a = 3;
      schemaObject.bar.b = 'bar';
      schemaObject.baz.c = 'baz';
      t.match(schemaObject, {
        foo: { a: 3 },
        bar: { b: 'bar' },
        baz: { c: 'baz' },
      });

      t.end();
    });

    tt.test(type + `: toRecordValue()`, (t) => {
      const list = stringList('foo', 'bar', 'baz');
      const val = [];
      /** @type {Record<'foo' | 'bar' | 'baz', any[]>|Record<typeof list['infered']['Tuple'][*], any[]>} */
      const schema = list.toRecordValue(val);
      t.match(schema, {
        foo: val,
        bar: val,
        baz: val,
      });
      schema.foo.push(3);
      t.ok(schema.foo !== val);
      t.match(schema.foo, [3]);
      t.match(schema.bar, val);
      schema.foo = [3];
      schema.bar = ['bar'];
      schema.baz = [];
      schema.foo = [{ a: 'a' }];
      t.match(schema, {
        foo: [{ a: 'a' }],
        bar: ['bar'],
        baz: [],
      });
      // @ts-expect-error
      schema.bar = 'bar';

      const val1 = {};
      const schema1 = list.toRecordValue(val1);
      t.ok(schema1.foo !== val1);
      t.match(schema1, {
        foo: {},
        bar: {},
        baz: {},
      });
      schema1.foo.a = 3;
      t.match(schema1, {
        foo: { a: 3 },
        bar: {},
        baz: {},
      });

      const schemaNumber = list.toRecordValue(0);
      t.match(schemaNumber, {
        foo: 0,
        bar: 0,
        baz: 0,
      });
      const schemaString = list.toRecordValue('');
      t.match(schemaString, {
        foo: '',
        bar: '',
        baz: '',
      });
      const schemaBoolean = list.toRecordValue(false);
      t.match(schemaBoolean, {
        foo: false,
        bar: false,
        baz: false,
      });
      schemaBoolean.foo = true;
      t.match(schemaBoolean, {
        foo: true,
        bar: false,
        baz: false,
      });

      const schemaUint8Array = list.toRecordValue(new Uint8Array());
      t.match(schemaUint8Array, {
        foo: new Uint8Array(),
        bar: new Uint8Array(),
        baz: new Uint8Array(),
      });

      const schemaFrozenObject = list.toRecordValue(Object.freeze({}));
      t.match(schemaFrozenObject, {
        foo: {},
        bar: {},
        baz: {},
      });

      /** @type {string[]} */
      const initial2 = [];
      /** @type {Record<'foo' | 'bar' | 'baz', string[]>|Record<typeof list['infered']['Tuple'][*], string[]>} */
      const schema2 = list.toRecordValue(initial2);
      t.match(schema2, {
        foo: [],
        bar: [],
        baz: [],
      });
      schema2.foo = ['bar'];
      t.match(schema2, {
        foo: ['bar'],
        bar: [],
        baz: [],
      });
      // @ts-expect-error
      schema2.bar = [3];
      // @ts-expect-error
      schema2.bar = 'bar';

      /** @type {string} */
      const initial3 = null;
      /** @type {Record<'foo' | 'bar' | 'baz', string>|Record<typeof list['infered']['Tuple'][*], string>} */
      const schema3 = list.toRecordValue(initial3);
      t.match(schema3, {
        foo: null,
        bar: null,
        baz: null,
      });
      schema3.foo = 'bar';
      schema3.baz = undefined;
      t.match(schema3, {
        foo: 'bar',
        bar: null,
        baz: undefined,
      });
      // @ts-expect-error
      schema3.bar = 3;
      // @ts-expect-error
      schema3.baz = [];

      /** @type {number} */
      const initialBase = null;
      const schemaBase = stringList('id', 'created', 'changed').toRecordValue(
        initialBase,
      );
      /** @type {string[]} */
      const initialTags = [];
      const schemaTags = stringList(
        'keywords',
        'categories',
        'hashtags',
      ).toRecordValue(initialTags);

      const entity = stringList('published', 'deleted').toRecordValue(
        false,
        schemaBase,
        schemaTags,
      );
      t.match(entity, {
        id: null,
        created: null,
        changed: null,
        keywords: [],
        categories: [],
        hashtags: [],
        published: false,
        deleted: false,
      });
      entity.id = 3;
      entity.deleted = true;
      entity.created = 1;
      entity.changed = 2;
      entity.keywords = ['a'];
      entity.categories = ['b'];
      entity.hashtags = ['#c', '#d'];
      entity.published = true;
      t.match(entity, {
        id: 3,
        created: 1,
        changed: 2,
        keywords: ['a'],
        categories: ['b'],
        hashtags: ['#c', '#d'],
        published: true,
        deleted: true,
      });
      // @ts-expect-error
      entity.tags = [];
      // @ts-expect-error
      entity.id = 'id';
      // @ts-expect-error
      entity.keywords = [3];
      // @ts-expect-error
      entity.created = true;
      // @ts-expect-error
      entity.keywords = 'a';

      t.end();
    });

    tt.test(type + ': toLowerCase()', (t) => {
      const list = stringList('Foo', 'Bar').toLowerCase();
      testExpectedArrayValues(t, list, 'foo', 'bar');
      testEscapingFromStringList(t, list, 'foo', 'bar');
      t.end();
    });

    tt.test(type + ': toUpperCase()', (t) => {
      const list = stringList('foo', 'bar').toUpperCase();
      testExpectedArrayValues(t, list, 'FOO', 'BAR');
      testEscapingFromStringList(t, list, 'FOO', 'BAR');
      t.end();
    });

    tt.test(type + ': toCapitalize()', (t) => {
      const list = stringList('foo zi', 'bar').toCapitalize();
      testExpectedArrayValues(t, list, 'Foo Zi', 'Bar');
      testEscapingFromStringList(t, list, 'Foo Zi', 'Bar');

      /** @type {'Foo Zi::Bar'} */
      const d = list.join('::');
      t.match(d, 'Foo Zi::Bar');
      t.end();
    });

    tt.test(type + ': toUnCapitalize()', (t) => {
      const list = stringList('Foo ZIiWa', 'BarBare').toUnCapitalize();
      testExpectedArrayValues(t, list, 'foo zIiWa', 'barBare');
      testEscapingFromStringList(t, list, 'foo zIiWa', 'barBare');

      /** @type {'foo zIiWa::barBare'} */
      const d = list.join('::');
      t.match(d, 'foo zIiWa::barBare');
      t.end();
    });

    tt.test(type + ': toSpliced()', (t) => {
      const list = stringList('foo', 'bar', 'baz').toSpliced(2, 1);
      testExpectedArrayValues(t, list, 'foo', 'bar');
      testExpectedArrayValues(
        t,
        list,
        ...['foo', 'bar', 'baz'].toSpliced(2, 1),
      );
      testEscapingFromStringList(t, list, 'foo', 'bar');

      /** @type {'foo::bar'} */
      const d = list.join('::');
      t.match(d, 'foo::bar');

      const list2 = stringList('foo', 'bar', 'baz').toSpliced(0, 2);
      testExpectedArrayValues(t, list2, 'baz');
      testExpectedArrayValues(
        t,
        list2,
        ...['foo', 'bar', 'baz'].toSpliced(0, 2),
      );
      testEscapingFromStringList(t, list2, 'baz');

      /** @type {'baz'} */
      const d2 = list2.join('::');
      t.match(d2, 'baz');

      const list3 = stringList('foo', 'bar', 'baz').toSpliced(0, 0);
      testExpectedArrayValues(t, list3, 'foo', 'bar', 'baz');
      testExpectedArrayValues(
        t,
        list3,
        ...['foo', 'bar', 'baz'].toSpliced(0, 0),
      );
      testEscapingFromStringList(t, list3, 'foo', 'bar', 'baz');

      /** @type {'foo::bar::baz'} */
      const d3 = list3.join('::');
      t.match(d3, 'foo::bar::baz');

      const list4 = stringList('foo', 'bar', 'baz').toSpliced(3, 1);
      testExpectedArrayValues(t, list4, 'foo', 'bar', 'baz');
      testExpectedArrayValues(
        t,
        list4,
        ...['foo', 'bar', 'baz'].toSpliced(3, 1),
      );
      testEscapingFromStringList(t, list4, 'foo', 'bar', 'baz');

      /** @type {'foo::bar::baz'} */
      const d4 = list4.join('::');
      t.match(d4, 'foo::bar::baz');

      const list5 = stringList('foo', 'bar', 'baz').toSpliced(-3, 1);
      testExpectedArrayValues(t, list5, 'bar', 'baz');
      testExpectedArrayValues(
        t,
        list5,
        ...['foo', 'bar', 'baz'].toSpliced(-3, 1),
      );
      testEscapingFromStringList(t, list5, 'bar', 'baz');

      /** @type {'bar::baz'} */
      const d5 = list5.join('::');
      t.match(d5, 'bar::baz');

      const list6 = stringList('foo', 'bar', 'baz').toSpliced(1);
      testExpectedArrayValues(t, list6, 'foo');
      testExpectedArrayValues(t, list6, ...['foo', 'bar', 'baz'].toSpliced(1));
      testEscapingFromStringList(t, list6, 'foo');

      /** @type {'foo'} */
      const d6 = list6.join('::');
      t.match(d6, 'foo');

      const list7 = stringList('foo', 'bar', 'baz').toSpliced(null);
      testExpectedArrayValues(t, list7);
      testExpectedArrayValues(
        t,
        list7,
        ...['foo', 'bar', 'baz'].toSpliced(null),
      );
      testEscapingFromStringList(t, list7);

      /** @type {''} */
      const d7 = list7.join('::');
      t.match(d7, '');

      t.end();
    });

    tt.test(type + ': toSpliced(...string[])', (t) => {
      const list = stringList('foo', 'bar', 'baz').toSpliced(
        0,
        2,
        'doink',
        'bleep',
      );
      testExpectedArrayValues(t, list, 'doink', 'bleep', 'baz');
      testExpectedArrayValues(
        t,
        list,
        ...['foo', 'bar', 'baz'].toSpliced(0, 2, 'doink', 'bleep'),
      );
      testEscapingFromStringList(t, list, 'doink', 'bleep', 'baz');

      /** @type {'doink::bleep::baz'} */
      const d = list.join('::');
      t.match(d, 'doink::bleep::baz');

      const list2 = stringList('foo', 'bar', 'baz').toSpliced(0, 0, 'bleep');
      testExpectedArrayValues(t, list2, 'bleep', 'foo', 'bar', 'baz');
      testExpectedArrayValues(
        t,
        list2,
        ...['foo', 'bar', 'baz'].toSpliced(0, 0, 'bleep'),
      );
      testEscapingFromStringList(t, list2, 'bleep', 'foo', 'bar', 'baz');

      /** @type {'bleep::foo::bar::baz'} */
      const d2 = list2.join('::');
      t.match(d2, 'bleep::foo::bar::baz');

      const list3 = stringList('foo', 'bar', 'baz').toSpliced(3, 1, 'doink');
      testExpectedArrayValues(t, list3, 'foo', 'bar', 'baz', 'doink');
      testExpectedArrayValues(
        t,
        list3,
        ...['foo', 'bar', 'baz'].toSpliced(3, 1, 'doink'),
      );
      testEscapingFromStringList(t, list3, 'foo', 'bar', 'baz', 'doink');

      /** @type {'foo::bar::baz::doink'} */
      const d3 = list3.join('::');
      t.match(d3, 'foo::bar::baz::doink');

      const list4 = stringList('foo', 'bar', 'baz').toSpliced(2, 0, 'doink');
      testExpectedArrayValues(t, list4, 'foo', 'bar', 'doink', 'baz');
      testExpectedArrayValues(
        t,
        list4,
        ...['foo', 'bar', 'baz'].toSpliced(2, 0, 'doink'),
      );
      testEscapingFromStringList(t, list4, 'foo', 'bar', 'doink', 'baz');

      /** @type {'foo::bar::doink::baz'} */
      const d4 = list4.join('::');
      t.match(d4, 'foo::bar::doink::baz');

      const list5 = stringList('foo', 'bar', 'baz').toSpliced(3, 0, 'doink');
      testExpectedArrayValues(t, list5, 'foo', 'bar', 'baz', 'doink');
      testExpectedArrayValues(
        t,
        list5,
        ...['foo', 'bar', 'baz'].toSpliced(3, 0, 'doink'),
      );
      testEscapingFromStringList(t, list5, 'foo', 'bar', 'baz', 'doink');

      /** @type {'foo::bar::baz::doink'} */
      const d5 = list5.join('::');
      t.match(d5, 'foo::bar::baz::doink');

      t.end();
    });

    tt.test(type + ': toSpliced(0)', (t) => {
      const list = stringList('foo', 'bar', 'baz').toSpliced(0);
      testExpectedArrayValues(t, list);
      testExpectedArrayValues(t, list, ...['foo', 'bar', 'baz'].toSpliced(0));
      testEscapingFromStringList(t, list);

      /** @type {''} */
      const d = list.join('::');
      t.match(d, '');

      const list2 = stringList('foo', 'bar', 'baz').toSpliced(3);
      testExpectedArrayValues(t, list2, 'foo', 'bar', 'baz');
      testExpectedArrayValues(t, list2, ...['foo', 'bar', 'baz'].toSpliced(3));
      testEscapingFromStringList(t, list2, 'foo', 'bar', 'baz');

      /** @type {'foo::bar::baz'} */
      const d2 = list2.join('::');
      t.match(d2, 'foo::bar::baz');

      const list3 = stringList('foo', 'bar', 'baz').toSpliced(-3, 6);
      testExpectedArrayValues(t, list3);
      testExpectedArrayValues(
        t,
        list3,
        ...['foo', 'bar', 'baz'].toSpliced(-3, 6),
      );
      testEscapingFromStringList(t, list3);

      /** @type {''} */
      const d3 = list3.join('::');
      t.match(d3, '');

      const list4 = stringList('foo', 'bar', 'baz').toSpliced(0, -2, 'doink');
      testExpectedArrayValues(t, list4, 'doink', 'foo', 'bar', 'baz');
      testExpectedArrayValues(
        t,
        list4,
        ...['foo', 'bar', 'baz'].toSpliced(0, -2, 'doink'),
      );
      testEscapingFromStringList(t, list4, 'doink', 'foo', 'bar', 'baz');

      /** @type {'doink::foo::bar::baz'} */
      const d4 = list4.join('::');
      t.match(d4, 'doink::foo::bar::baz');

      const list5 = stringList('foo', 'bar', 'baz').toSpliced(3, -2, 'doink');
      testExpectedArrayValues(t, list5, 'foo', 'bar', 'baz', 'doink');
      testExpectedArrayValues(
        t,
        list5,
        ...['foo', 'bar', 'baz'].toSpliced(3, -2, 'doink'),
      );
      testEscapingFromStringList(t, list5, 'foo', 'bar', 'baz', 'doink');

      /** @type {'foo::bar::baz::doink'} */
      const d5 = list5.join('::');
      t.match(d5, 'foo::bar::baz::doink');

      const list6 = stringList().toSpliced(-3, -2, 'doink');
      testExpectedArrayValues(t, list6, 'doink');
      testExpectedArrayValues(t, list6, ...[].toSpliced(-3, -2, 'doink'));
      testEscapingFromStringList(t, list6, 'doink');

      /** @type {'doink'} */
      const d6 = list6.join('::');
      t.match(d6, 'doink');

      const list7 = stringList('foo', 'bar', 'baz').toSpliced(
        0,
        undefined,
        'd',
      );
      testExpectedArrayValues(t, list7, 'd', 'foo', 'bar', 'baz');
      testExpectedArrayValues(
        t,
        list7,
        ...['foo', 'bar', 'baz'].toSpliced(0, undefined, 'd'),
      );
      testEscapingFromStringList(t, list7, 'd', 'foo', 'bar', 'baz');

      /** @type {'d::foo::bar::baz'} */
      const d7 = list7.join('::');
      t.match(d7, 'd::foo::bar::baz');

      const list8 = stringList('d', 'd', 'd', 'd').toSpliced(-3, 2, 'doink');
      testExpectedArrayValues(t, list8, 'd', 'doink', 'd');
      testExpectedArrayValues(
        t,
        list8,
        ...['d', 'd', 'd', 'd'].toSpliced(-3, 2, 'doink'),
      );
      testEscapingFromStringList(t, list8, 'd', 'doink', 'd');

      /** @type {'d::doink::d'} */
      const d8 = list8.join('::');
      t.match(d8, 'd::doink::d');

      const list9 = stringList('d', 'd', 'd', 'd').toSpliced(
        -2,
        1,
        'doink',
        'doank',
      );
      testExpectedArrayValues(t, list9, 'd', 'd', 'doink', 'doank', 'd');
      testExpectedArrayValues(
        t,
        list9,
        ...['d', 'd', 'd', 'd'].toSpliced(-2, 1, 'doink', 'doank'),
      );
      testEscapingFromStringList(t, list9, 'd', 'd', 'doink', 'doank', 'd');

      /** @type {'d::d::doink::doank::d'} */
      const d9 = list9.join('::');
      t.match(d9, 'd::d::doink::doank::d');

      const list10 = stringList('d', 'd', 'd', 'd').toSpliced(
        -3,
        -2,
        'doink',
        'doank',
      );
      testExpectedArrayValues(t, list10, 'd', 'doink', 'doank', 'd', 'd', 'd');
      testExpectedArrayValues(
        t,
        list10,
        ...['d', 'd', 'd', 'd'].toSpliced(-3, -2, 'doink', 'doank'),
      );
      testEscapingFromStringList(
        t,
        list10,
        'd',
        'doink',
        'doank',
        'd',
        'd',
        'd',
      );

      /** @type {'d::doink::doank::d::d::d'} */
      const d10 = list10.join('::');
      t.match(d10, 'd::doink::doank::d::d::d');

      const listfoobar = stringList('d', 'd', 'd', 'd')
        .toSpliced(-3, -2, 'doink', 'doank')
        .concat('foo', 'bar')
        .without('d', 'c')
        .withReplaceAll('o', '$')
        .concat('La Bananne ', " L'annanas")
        .withReplaceAll('$', 'o')
        .toReversed()
        .concat(' miercoles')
        .withTrim()
        .toLowerCase()
        .withReplaceAll("'", '')
        .withReplaceAll('  ', '_')
        .withReplaceAll(' ', '_')
        .slice(-10);

      testExpectedArrayValues(
        t,
        listfoobar,
        'lannanas',
        'la_bananne',
        'bar',
        'foo',
        'doank',
        'doink',
        'miercoles',
      );
      testExpectedArrayValues(
        t,
        listfoobar,
        ...['d', 'd', 'd', 'd']
          .toSpliced(-3, -2, 'doink', 'doank')
          .concat(['foo', 'bar'])
          .filter((v) => !['d', 'c'].includes(v))
          .concat(['La Bananne ', " L'annanas"])
          .toReversed()
          .concat([' miercoles'])
          .map((v) => v.trim())
          .map((v) =>
            v
              .trim()
              .replace(/([A-Z])/g, (_, char) => `_${char.toLowerCase()}`)
              .replace(/^[_]+/, '')
              .replace(/[^a-zA-Z0-9_]+/g, '')
              .replace(/[_]+/g, '_')
              .toLowerCase()
              .replace(/[\s]+/g, '_'),
          )
          .slice(-10),
      );

      /** @type {'lannanas::la_bananne::bar::foo::doank::doink::miercoles'} */
      const dfoobar = listfoobar.join('::');
      t.match(
        dfoobar,
        'lannanas::la_bananne::bar::foo::doank::doink::miercoles',
      );

      /** @type {"la_la_lannanas_la_la::la_la_la_bananne_la_la::la_la_bar_la_la::la_la_foo_la_la::la_la_doank_la_la::la_la_doink_la_la::la_la_miercoles_la_la::la_la_la folie_la_la"} */
      const dfoobar2 = listfoobar
        .concat('la folie')
        .withPrefix('la_la_')
        .withSuffix('_la_la')
        .join('::');
      t.match(
        dfoobar2,
        'la_la_lannanas_la_la::la_la_la_bananne_la_la::la_la_bar_la_la::la_la_foo_la_la::la_la_doank_la_la::la_la_doink_la_la::la_la_miercoles_la_la::la_la_la folie_la_la',
      );

      t.end();
    });

    tt.test('stringList: asObject()', (t) => {
      const list = stringList('foo', 'bar', 'baz');
      const obj = list.asObject();
      t.match(obj, {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
      });
      testExpectedArrayValues(t, list, 'foo', 'bar', 'baz');
      t.equal(obj.foo, 'foo');
      t.equal(obj.bar, 'bar');
      t.equal(obj.baz, 'baz');
      t.equal(obj.fooz, undefined);
      t.end();
    });
    tt.test('stringList: asMap()', (t) => {
      const list = stringList('foo', 'bar', 'baz');
      const map = list.asMap();
      t.match(
        map,
        new Map([
          ['foo', 'foo'],
          ['bar', 'bar'],
          ['baz', 'baz'],
        ]),
      );
      testExpectedArrayValues(t, list, 'foo', 'bar', 'baz');
      t.equal(map.size, 3);
      t.equal(map.get('foo'), 'foo');
      t.equal(map.get('bar'), 'bar');
      t.equal(map.get('baz'), 'baz');
      t.equal(map.get('fooz'), undefined);

      t.end();
    });
    tt.test('stringList: asSet()', (t) => {
      const list = stringList('foo', 'bar', 'baz');
      const set = list.asSet();
      t.match(set, new Set(['foo', 'bar', 'baz']));
      testExpectedArrayValues(t, list, 'foo', 'bar', 'baz');
      t.equal(set.size, 3);
      t.equal(set.has('foo'), true);
      t.equal(set.has('bar'), true);
      t.equal(set.has('baz'), true);
      t.equal(set.has('fooz'), false);
      t.end();
    });

    tt.test('stringList: mapAsObject()', (t) => {
      const list = stringList('foo', 'bar', 'baz');
      const obj = list.mapAsObject((v) => ({
        value: '',
        foo: {
          bar: '',
        },
      }));
      t.match(
        obj,
        Object.fromEntries([
          ['foo', { value: '', foo: { bar: '' } }],
          ['bar', { value: '', foo: { bar: '' } }],
          ['baz', { value: '', foo: { bar: '' } }],
        ]),
      );
      obj['bar'].foo.bar = 'barz';
      t.match(
        obj,
        Object.fromEntries([
          ['foo', { value: '', foo: { bar: '' } }],
          ['bar', { value: '', foo: { bar: 'barz' } }],
          ['baz', { value: '', foo: { bar: '' } }],
        ]),
      );
      testExpectedArrayValues(t, list, 'foo', 'bar', 'baz');
      t.end();
    });
    tt.test('stringList: mapAsObject()', (t) => {
      const list = stringList('foo', 'bar', 'baz');
      const obj = list.mapAsObject((v) =>
        v === 'bar'
          ? {
              name: 'bar',
            }
          : {
              value: '',
              foo: {
                bar: '',
              },
            },
      );
      t.match(
        obj,
        Object.fromEntries([
          ['foo', { value: '', foo: { bar: '' } }],
          ['bar', { name: 'bar' }],
          ['baz', { value: '', foo: { bar: '' } }],
        ]),
      );
      obj['bar'].foo = 'barz';
      t.match(
        obj,
        Object.fromEntries([
          ['foo', { value: '', foo: { bar: '' } }],
          ['bar', { name: 'bar', foo: 'barz' }],
          ['baz', { value: '', foo: { bar: '' } }],
        ]),
      );
      testExpectedArrayValues(t, list, 'foo', 'bar', 'baz');
      t.end();
    });

    tt.test('stringList: push()', (t) => {
      if (
        type !== 'mutable' &&
        type !== 'mutableCjs' &&
        type !== 'mutableEsm'
      ) {
        t.pass('skipping test for immutable');
        t.end();
        return;
      }
      const list = stringList('foo', 'bar', 'baz');
      list.push('doink');
      testExpectedArrayValues(t, list, 'foo', 'bar', 'baz', 'doink');
      t.match([...list], list.mutable());

      list.push('');
      testExpectedArrayValues(t, list, 'foo', 'bar', 'baz', 'doink', '');
      t.match([...list], list.mutable());

      t.end();
    });

    tt.test('stringList: splice()', (t) => {
      if (
        type !== 'mutable' &&
        type !== 'mutableCjs' &&
        type !== 'mutableEsm'
      ) {
        t.pass('skipping test for immutable');
        t.end();
        return;
      }
      const list = stringList('foo', 'bar', 'baz');
      const list2 = list.splice(2, 1);
      testExpectedArrayValues(t, list, 'foo', 'bar');
      t.match(list2, ['foo', 'bar', 'baz'].splice(2, 1));

      /** @type {'baz'} */
      const d = list2.join('::');
      t.match(d, 'baz');

      const list3 = stringList('foo', '', 'bar', '').splice(0, 2);
      t.match(list3, ['foo', '']);
      t.match(list3, ['foo', '', 'bar', ''].splice(0, 2));

      /** @type {'foo::'} */
      const d2 = list3.join('::');
      t.match(d2, 'foo::');

      const list4 = stringList('foo', 'bar', 'baz').splice(0, 0);
      t.match(list4, []);
      t.match(list4, ['foo', 'bar', 'baz'].splice(0, 0));

      /** @type {''} */
      const d3 = list4.join('::');
      t.match(d3, '');

      const list5 = stringList('foo', 'bar', 'baz').splice(3, 1);
      t.match(list5, []);
      t.match(list5, ['foo', 'bar', 'baz'].splice(3, 1));

      /** @type {''} */
      const d4 = list5.join('::');
      t.match(d4, '');

      const list6 = stringList('foo', 'bar', 'baz').splice(-3, 1);
      t.match(list6, ['foo']);
      t.match(list6, ['foo', 'bar', 'baz'].splice(-3, 1));

      /** @type {'foo'} */
      const d5 = list6.join('::');

      t.match(d5, 'foo');

      const list7 = stringList('foo', 'bar', 'baz').splice(1);
      t.match(list7, ['bar', 'baz']);
      t.match(list7, ['foo', 'bar', 'baz'].splice(1));

      /** @type {'bar::baz'} */
      const d6 = list7.join('::');
      t.match(d6, 'bar::baz');

      const list8 = stringList('foo', 'bar', 'baz').splice(null);
      t.match(list8, ['foo', 'bar', 'baz'].splice(null));

      /** @type {'foo::bar::baz'} */
      const d7 = list8.join('::');
      t.match(d7, 'foo::bar::baz');

      t.end();
    });

    tt.test('stringList: pop()', (t) => {
      if (
        type !== 'mutable' &&
        type !== 'mutableCjs' &&
        type !== 'mutableEsm'
      ) {
        t.pass('skipping test for immutable');
        t.end();
        return;
      }
      const list = stringList('foo', '', 'bar', 'baz', '');
      const last = list.pop();
      t.equal(last, '');
      testExpectedArrayValues(t, list, 'foo', '', 'bar', 'baz');
      t.match([...list], list.mutable());

      t.end();
    });

    tt.test('stringList: shift()', (t) => {
      if (
        type !== 'mutable' &&
        type !== 'mutableCjs' &&
        type !== 'mutableEsm'
      ) {
        t.pass('skipping test for immutable');
        t.end();
        return;
      }
      const list = stringList('foo', 'bar', 'baz', '');
      const first = list.shift();
      t.equal(first, 'foo');
      testExpectedArrayValues(t, list, 'bar', 'baz', '');
      t.match([...list], list.mutable());

      t.end();
    });

    tt.test('stringList: unshift()', (t) => {
      if (
        type !== 'mutable' &&
        type !== 'mutableCjs' &&
        type !== 'mutableEsm'
      ) {
        t.pass('skipping test for immutable');
        t.end();
        return;
      }
      const list = stringList('foo', 'bar', 'baz', '');
      list.unshift('doink');
      testExpectedArrayValues(t, list, 'doink', 'foo', 'bar', 'baz', '');
      t.match([...list], list.mutable());

      list.unshift('');
      testExpectedArrayValues(t, list, '', 'doink', 'foo', 'bar', 'baz', '');
      t.match([...list], list.mutable());

      t.end();
    });

    tt.test('stringList: copyWithin()', (t) => {
      if (
        type !== 'mutable' &&
        type !== 'mutableCjs' &&
        type !== 'mutableEsm'
      ) {
        t.pass('skipping test for immutable');
        t.end();
        return;
      }
      const list = stringList('foo', 'bar', 'baz', '');
      const list2 = list.copyWithin(1, 0);
      const listMatch = ['foo', 'bar', 'baz', ''];
      listMatch.copyWithin(1, 0);
      testExpectedArrayValues(t, list, ...listMatch);
      t.match(list2, ['foo', 'bar', 'baz', ''].copyWithin(1, 0));

      /** @type {'foo::foo::bar::baz'} */
      const d = list.join('::');
      t.match(d, 'foo::foo::bar::baz');

      const list3 = stringList('foo', 'bar', 'baz', '').copyWithin(0, 2);
      t.match(list3, ['baz', ''].concat(['baz', ''].slice(0, 2)));

      /** @type {'baz::::baz::'} */
      const d2 = list3.join('::');
      t.match(d2, 'baz::::baz::');

      const list4 = stringList('foo', 'bar', 'baz', '').copyWithin(0, 2, 3);
      t.match(list4, ['baz', 'bar', 'baz', ''].copyWithin(0, 2, 3));

      /** @type {'baz::bar::baz::'} */
      const d3 = list4.join('::');
      t.match(d3, 'baz::bar::baz::');

      const list5 = stringList('foo', 'bar', 'baz', '').copyWithin(0, -3, -2);
      t.match(list5, ['foo', 'bar', 'baz', ''].copyWithin(0, -3, -2));

      /** @type {'bar::bar::baz::'} */
      const d4 = list5.join('::');
      t.match(d4, 'bar::bar::baz::');

      const list6 = stringList('foo', 'bar', 'baz', '').copyWithin(0, -2, -1);
      t.match(list6, ['foo', 'bar', 'baz', ''].copyWithin(0, -2, -1));

      /** @type {'baz::bar::baz::'} */
      const d5 = list6.join('::');
      t.match(d5, 'baz::bar::baz::');

      t.end();
    });

    tt.test('stringList: fill()', (t) => {
      if (
        type !== 'mutable' &&
        type !== 'mutableCjs' &&
        type !== 'mutableEsm'
      ) {
        t.pass('skipping test for immutable');
        t.end();
        return;
      }
      const list = stringList('foo', 'bar', 'baz', '');
      const list2 = list.fill('doink');
      testExpectedArrayValues(t, list, 'doink', 'doink', 'doink', 'doink');
      t.match([...list], list.mutable());

      const list3 = stringList('foo', 'bar', 'baz', '').fill('', 1, 2);
      testExpectedArrayValues(t, list3, 'foo', '', 'baz', '');
      t.match([...list3], list3.mutable());

      t.end();
    });
  });
}
