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

  enum = new Proxy(
    {
      self: this,
    },
    {
      get(target, property) {
        if (typeof property !== 'string' || !target.self.includes(property)) {
          return undefined;
        }
        return target.self.value(property);
      },
    },
  );
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
