/// <reference path="./types.d.ts" />

/**
 * @type {Readonly<isl.ISL>}
 */
class SL extends Array {
  concat() {
    return Object.freeze(new SL(...super.concat.apply(this, arguments)));
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
}
SL.prototype.slice = undefined;
SL.prototype.reverse = undefined;
SL.prototype.unshift = undefined;
SL.prototype.pop = undefined;
SL.prototype.shift = undefined;
SL.prototype.fill = undefined;
SL.prototype.splice = undefined;
SL.prototype.copyWithin = undefined;
SL.prototype.push = undefined;

/**
 * @template {string} T
 * @param {...T} strings
 * @returns {Readonly<isl.ISL<(Record<T, T>)[keyof (Record<T, T>)]>>}
 */
export const stringList = (...strings) => {
  if (strings.some((el) => typeof el !== 'string')) {
    throw new Error(`Not a string in stringList ${strings[0]}`);
  }
  // @ts-expect-error[2322]
  return new SL(...strings);
};
