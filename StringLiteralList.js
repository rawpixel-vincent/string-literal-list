import 'core-js/actual/array/to-reversed.js';
import 'core-js/actual/array/to-sorted.js';
import 'core-js/actual/array/to-spliced.js';
import 'core-js/actual/array/with.js';

const freezeIfImmutable = (source, target) => {
  if (Object.isFrozen(source)) {
    return Object.freeze(target);
  }
  return target;
};

export class SL extends Array {
  literal = undefined;
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

  withReplace(string, replacement = '') {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => e.replace(string, replacement))),
    );
  }

  withReplaceAll(string, replacement = '') {
    return freezeIfImmutable(
      this,
      new SL(...super.map((e) => e.replaceAll(string, replacement))),
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

  toSpliced() {
    const mut = this.mutable();
    return mut.toSpliced.apply(mut, arguments);
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

export class SLS extends SL {}
