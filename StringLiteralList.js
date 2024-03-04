import 'core-js/actual/array/to-reversed.js';
import 'core-js/actual/array/to-sorted.js';
import 'core-js/actual/array/to-spliced.js';
import 'core-js/actual/array/with.js';

export class SL extends Array {
  literal = undefined;
  enum;
  constructor(...args) {
    super(...args);
    this.enum = Object.freeze(Object.fromEntries(this.map((v) => [v, v])));
  }

  concat(...args) {
    return Object.freeze(new SL(...super.concat.apply(this, args.flat())));
  }

  toSorted() {
    return Object.freeze(new SL(...super.toSorted.apply(this, arguments)));
  }

  toReversed() {
    return Object.freeze(new SL(...super.toReversed.apply(this, arguments)));
  }

  slice() {
    return Object.freeze(new SL(...super.slice.apply(this, arguments)));
  }

  withPrefix(prefix) {
    return Object.freeze(new SL(...super.map((e) => `${prefix}${e}`)));
  }

  withSuffix(suffix) {
    return Object.freeze(new SL(...super.map((e) => `${e}${suffix}`)));
  }

  withDerivatedSuffix(chars) {
    return Object.freeze(
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

  withDerivatedPrefix(chars) {
    return Object.freeze(
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

  value(value) {
    if (this.enum[value]) {
      return value;
    }
    throw new Error(`Invalid value ${value}`);
  }

  // Get the native array
  mutable() {
    return Array.from(this.values());
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

Object.values(ARRAY_IN_PLACE_MUTATION).forEach((el) => {
  SL.prototype[el] = function () {
    /* c8 ignore start */
    if (
      typeof window === 'undefined' &&
      process?.env?.NODE_ENV !== 'production' &&
      process?.env?.NODE_ENV !== 'test'
    ) {
      console && console.debug(`Array method ${el} is not supported`);
    }
    /* c8 ignore stop */
    return Array.prototype[el].apply(this.mutable(), arguments);
  };
});
