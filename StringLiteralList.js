import 'core-js/actual/array/to-reversed.js';
import 'core-js/actual/array/to-sorted.js';
import 'core-js/actual/array/to-spliced.js';
import 'core-js/actual/array/find-last-index.js';
import 'core-js/actual/array/with.js';

const SeparatorsRegexp = /[[|\]{}()\\/\-_\\ .,\]]+/g;

const freezeIfImmutable = (source, target) => {
  if (source && target && Object.isFrozen(source)) {
    return Object.freeze(target);
  }
  return target;
};

export class SL extends Array {
  infered = {
    Union: undefined,
    Tuple: undefined,
    Mutable: undefined,
    Unsorted: undefined,
  };

  enum;
  hasEmpty = false;
  constructor(...args) {
    const entries = [];
    const arr = [];
    let emptyFound = false;
    for (const str of args.flat()) {
      if (typeof str === 'string') {
        if (str === '') {
          emptyFound = true;
        }
        entries.push([str, str]);
        arr.push(str);
      }
    }
    super(...arr);
    this.hasEmpty = emptyFound;
    this.enum = Object.fromEntries(entries);

    if (this.hasEmpty) {
      this.enum[''] = '';
    }
    Object.freeze(this.enum);
  }

  concat(...args) {
    return freezeIfImmutable(
      this,
      new SL(...super.concat.apply(this, args.flat())),
    );
  }

  concatList(list) {
    return this.concat(...list);
  }

  toSorted() {
    return freezeIfImmutable(
      this,
      new SL(...super.toSorted.apply(this, arguments)),
    );
  }

  toReversed() {
    return freezeIfImmutable(
      this,
      new SL(...super.toReversed.apply(this, arguments)),
    );
  }

  reverse() {
    return freezeIfImmutable(
      this,
      new SL(...super.reverse.apply(this, arguments)),
    );
  }

  toSpliced() {
    return freezeIfImmutable(
      this,
      new SL(...super.toSpliced.apply(this, arguments)),
    );
  }

  slice() {
    return freezeIfImmutable(
      this,
      new SL(...super.slice.apply(this, arguments)),
    );
  }

  without() {
    const values = Array.from(arguments).flatMap((el) =>
      Array.isArray(el)
        ? el.filter((s) => typeof s === 'string')
        : typeof el === 'string'
          ? [el]
          : [],
    );
    return freezeIfImmutable(
      this,
      new SL(...this.filter((e) => !values.includes(e))),
    );
  }

  withTrim() {
    return freezeIfImmutable(this, new SL(...super.map((e) => e.trim())));
  }

  withPrefix(prefix = '') {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => `${prefix}${e}`)),
    );
  }

  withSuffix(suffix = '') {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => `${e}${suffix}`)),
    );
  }

  withDerivatedSuffix(chars = '') {
    return freezeIfImmutable(
      this,
      new SL(
        ...super.flatMap((t) => [
          t,
          t.endsWith(chars)
            ? t.slice(0, Math.min(t.length, chars.length) * -1)
            : `${t}${chars}`,
        ]),
      ),
    );
  }

  withDerivatedPrefix(chars = '') {
    return freezeIfImmutable(
      this,
      new SL(
        ...super.flatMap((t) => [
          t,
          t.startsWith(chars)
            ? t.slice(Math.min(chars.length, t.length), t.length)
            : `${chars}${t}`,
        ]),
      ),
    );
  }

  withReplace(string, replacement = undefined) {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => e.replace(string, replacement))),
    );
  }

  withReplaceAll(string, replacement = undefined) {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => e.replaceAll(string, replacement))),
    );
  }

  toLowerCase() {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => e.toLowerCase())),
    );
  }

  toUpperCase() {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => e.toUpperCase())),
    );
  }

  toCapitalize() {
    return this.withReplace(/\b\w/g, (char) => char.toUpperCase());
  }

  toUnCapitalize() {
    return this.withReplace(/\b\w/g, (char) => char.toLowerCase());
  }

  toPascalCase() {
    return freezeIfImmutable(
      this,
      new SL(
        ...super.map((e) =>
          e
            .trim()
            .replace(SeparatorsRegexp, '_')
            .replace(/[^a-z0-9_]+/gi, '')
            .replace(/[_]+/g, '_')
            .replace(/(?:^|_)(\w)/g, (_, char) => char.toUpperCase())
            .replace(/[\s_]+/g, '')
            .trim(),
        ),
      ),
    ).toCapitalize();
  }

  toCamelCase() {
    return this.withPrefix('_').toPascalCase().toUnCapitalize();
  }

  toSnakeCase() {
    return freezeIfImmutable(
      this,
      new SL(
        ...super.map((e) =>
          e
            .trim()
            .replace(SeparatorsRegexp, '_')
            .replace(/[^a-z0-9_]+/gi, '')
            .replace(/([A-Z])/g, (_, char) => `_${char.toLowerCase()}`)
            .replace(/[\s_]+/g, '_')
            .replace(/^[_]+/g, '')
            .toLowerCase()
            .trim(),
        ),
      ),
    );
  }

  value(value) {
    if (
      typeof value === 'string' &&
      (this.enum[value] || (this.hasEmpty && value === ''))
    ) {
      return value;
    }
    throw new Error(`Invalid value ${value}`);
  }

  // Get the native array
  mutable() {
    return Array.from(this);
  }

  toRecordValue(initialValue = undefined, ...records) {
    return Object.assign(
      {},
      ...records,
      Object.fromEntries(super.map((e) => [e, initialValue])),
    );
  }

  toRecordType(type = 'any', initialValue = undefined, ...records) {
    return Object.assign(
      {},
      ...records,
      Object.fromEntries(super.map((e) => [e, initialValue])),
    );
  }

  // Methods returning the native array
  map() {
    const mut = this.mutable();
    return mut.map.apply(mut, arguments);
  }

  filter() {
    const mut = this.mutable();
    return mut.filter.apply(mut, arguments);
  }

  reduce() {
    const mut = this.mutable();
    return mut.reduce.apply(mut, arguments);
  }

  reduceRight() {
    const mut = this.mutable();
    return mut.reduceRight.apply(mut, arguments);
  }

  flat() {
    const mut = this.mutable();
    return mut.flat.apply(mut, arguments);
  }

  flatMap() {
    const mut = this.mutable();
    return mut.flatMap.apply(mut, arguments);
  }

  with() {
    const mut = this.mutable();
    return mut.with.apply(mut, arguments);
  }
}

export const ARRAY_IN_PLACE_MUTATION = Object.freeze({
  push: 'push',
  unshift: 'unshift',
  shift: 'shift',
  copyWithin: 'copyWithin',
  pop: 'pop',
  fill: 'fill',
  splice: 'splice',
});
