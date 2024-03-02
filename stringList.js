/// <reference path="./types.d.ts" />

/**
 * @type {Readonly<isl.ISL>}
 */
class SL extends Array {
  concat() {
    return Object.freeze(super.concat.apply(this, arguments));
  }

  toSorted() {
    return Object.freeze(super.toSorted.apply(this, arguments));
  }

  toReversed() {
    return Object.freeze(super.toReversed.apply(this, arguments));
  }

  withPrefix(prefix) {
    return Object.freeze(this.map((e) => `${prefix}${e}`));
  }

  withSuffix(suffix) {
    return Object.freeze(this.map((e) => `${e}${suffix}`));
  }

  mutable() {
    return Array.from(this);
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

export default {
  stringList,
};
