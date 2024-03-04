import 'core-js/actual/array/to-reversed.js';
import 'core-js/actual/array/to-sorted.js';
import 'core-js/actual/array/to-spliced.js';
import 'core-js/actual/array/with.js';

export class SL extends Array {
  literal = undefined;
  concat(...args) {
    return Object.freeze(new SL(...super.concat.apply(this, args.flat())));
  }

  toSorted() {
    return Object.freeze(new SL(...super.toSorted.apply(this, arguments)));
  }

  toReversed() {
    return Object.freeze(new SL(...super.toReversed.apply(this, arguments)));
  }

  withPrefix(prefix) {
    return Object.freeze(new SL(...super.map((e) => `${prefix}${e}`)));
  }

  withSuffix(suffix) {
    return Object.freeze(new SL(...super.map((e) => `${e}${suffix}`)));
  }

  value(value) {
    if (this.includes(value)) {
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
  slice: 'slice',
  sort: 'sort',
  unshift: 'unshift',
  shift: 'shift',
  copyWithin: 'copyWithin',
  pop: 'pop',
  fill: 'fill',
  splice: 'splice',
  reverse: 'reverse',
});
Object.values(ARRAY_IN_PLACE_MUTATION).forEach((el) => {
  SL.prototype[el] = () => {
    throw new Error(`Array method ${el} is not supported by StringLiteralList`);
  };
});
