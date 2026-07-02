const freezeIfImmutable = (source, target) => {
  if (source && target && Object.isFrozen(source)) {
    /* c8 ignore next 3 @preserve */
    return Object.freeze(target);
  }
  return target;
};

// Normalize without()/pick() arguments (strings, numbers, nested lists)
// into a Set for O(n+m) filtering.
const valueSet = (values) => {
  const set = new Set();
  for (const v of values) {
    if (Array.isArray(v)) {
      for (const ve of v) {
        set.add(typeof ve === 'number' ? String(ve) : ve);
      }
    } else {
      set.add(typeof v === 'number' ? String(v) : v);
    }
  }
  return set;
};

/* c8 ignore start */
const mutationWarning = (method) =>
  `Using ${method}() method on a string list will mutate the original list in place. The code relying on this list will behave unexpectedly and may lead to unsafe execution.`;
/* c8 ignore stop */

/* c8 ignore start */
const shouldWarn =
  typeof console === 'object' &&
  typeof console.warn === 'function' &&
  typeof window === 'undefined' &&
  typeof process === 'object' &&
  typeof process.env === 'object' &&
  typeof process.env.STRING_LITERAL_LIST_DEBUG !== 'undefined' &&
  typeof process.env.NODE_ENV === 'string' &&
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'test';
/* c8 ignore stop */

export class SL extends Array {
  // #infered = {
  //   Union: undefined,
  //   Tuple: undefined,
  //   Mutable: undefined,
  //   Unsorted: undefined,
  // };

  enum;

  constructor(arr) {
    super();
    this.enum = Object.create(null);
    if (Array.isArray(arr) && arr.length > 0) {
      // single pass; chunked push.apply to stay under the argument limit
      const size = 2000;
      let chunk = [];
      for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        if (typeof e === 'string') {
          chunk.push(e);
          this.enum[e] = e;
        } else if (typeof e === 'number') {
          const s = String(e);
          chunk.push(s);
          this.enum[s] = s;
        }
        if (chunk.length === size) {
          Array.prototype.push.apply(this, chunk);
          chunk = [];
        }
      }
      if (chunk.length > 0) {
        Array.prototype.push.apply(this, chunk);
      }
    }

    Object.defineProperty(this, 'enum', {
      writable: true,
      configurable: false,
      enumerable: false,
    });
  }

  /**
   * Internal factory for derived lists whose elements are already known to
   * be strings (produced from this list). Skips the constructor validation
   * and builds the enum in a single pass.
   * @param {string[]} arr
   */
  static fromTrusted(arr) {
    const list = new SL();
    const size = 2000;
    for (let i = 0; i < arr.length; i += size) {
      Array.prototype.push.apply(list, Array.prototype.slice.call(arr, i, i + size));
    }
    for (let i = 0; i < arr.length; i++) {
      list.enum[arr[i]] = arr[i];
    }
    return list;
  }

  includes(searchElement, fromIndex = 0) {
    // Numbers are intentionally accepted ('5' matches 5): this is a string
    // list and the enum key lookup coerces them, which maximizes
    // compatibility with downstream consumers. Anything else (objects,
    // arrays, ...) must not match through the same property-key coercion.
    if (typeof searchElement !== 'string' && typeof searchElement !== 'number') {
      return false;
    }
    if (
      this.length === 0 ||
      fromIndex >= this.length ||
      !Object.prototype.hasOwnProperty.call(this.enum, searchElement)
    ) {
      return false;
    }
    if (
      fromIndex !== 0 &&
      typeof fromIndex === 'number' &&
      (fromIndex > 0 || fromIndex >= this.length * -1)
    ) {
      return Array.prototype.includes.call(this, searchElement, fromIndex);
    }

    return true;
  }

  concat(...args) {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.concat.apply(this, args.flat())),
    );
  }

  concatList(list) {
    return freezeIfImmutable(this, new SL(Array.prototype.concat.apply(this, list)));
  }

  toSorted() {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.toSorted.apply(this, arguments)),
    );
  }

  toReversed() {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.toReversed.apply(this, arguments)),
    );
  }

  toSpliced() {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.toSpliced.apply(this, arguments)),
    );
  }

  slice() {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.slice.apply(Array.from(this), arguments)),
    );
  }

  without(...values) {
    const excluded = valueSet(values);
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.filter.call(this, (e) => !excluded.has(e))),
    );
  }

  pick(...values) {
    /* c8 ignore start */
    if (values.length === 0) {
      return this;
    }
    /* c8 ignore stop */

    const kept = valueSet(values);
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.filter.call(this, (e) => kept.has(e))),
    );
  }

  withTrim() {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.map.call(this, (e) => e.trim())),
    );
  }

  withPrefix(prefix = '') {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.map.call(this, (e) => `${prefix}${e}`)),
    );
  }

  withSuffix(suffix = '') {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.map.call(this, (e) => `${e}${suffix}`)),
    );
  }

  // withDerivatedSuffix(chars = '') {
  //   return freezeIfImmutable(
  //     this,
  //     new SL(
  //       ...super.flatMap((t) => [
  //         t,
  //         t.endsWith(chars)
  //           ? t.slice(0, Math.min(t.length, chars.length) * -1)
  //           : `${t}${chars}`,
  //       ]),
  //     ),
  //   );
  // }

  // withDerivatedPrefix(chars = '') {
  //   return freezeIfImmutable(
  //     this,
  //     new SL(
  //       ...super.flatMap((t) => [
  //         t,
  //         t.startsWith(chars)
  //           ? t.slice(Math.min(chars.length, t.length), t.length)
  //           : `${chars}${t}`,
  //       ]),
  //     ),
  //   );
  // }

  withReplace(string, replacement = undefined) {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(
        Array.prototype.map.call(this, (e) => e.replace(string, replacement)),
      ),
    );
  }

  withReplaceAll(string, replacement = undefined) {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(
        Array.prototype.map.call(this, (e) => e.replaceAll(string, replacement)),
      ),
    );
  }

  toLowerCase() {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.map.call(this, (e) => e.toLowerCase())),
    );
  }

  toUpperCase() {
    return freezeIfImmutable(
      this,
      SL.fromTrusted(Array.prototype.map.call(this, (e) => e.toUpperCase())),
    );
  }

  toCapitalize() {
    return this.withReplace(/\b\w/g, (char) => char.toUpperCase());
  }

  toUnCapitalize() {
    return this.withReplace(/\b\w/g, (char) => char.toLowerCase());
  }

  value(value) {
    if (
      typeof value !== 'string' ||
      !Object.prototype.hasOwnProperty.call(this.enum, value)
    ) {
      throw new Error(`Invalid value ${value}`);
    }
    return this.enum[value];
  }

  // Get the native array
  mutable() {
    return Array.prototype.slice.call(Array.from(this));
  }

  compat() {
    return this;
  }

  happy() {
    return this;
  }

  stringList() {
    return this;
  }

  toRecordValue(initialValue = undefined, ...records) {
    return Object.assign(
      {},
      ...records,
      Object.fromEntries(
        super.map.call(this, (e) => {
          try {
            return [
              e,
              typeof initialValue === 'object' && initialValue !== null
                ? Array.isArray(initialValue)
                  ? initialValue.slice()
                  : typeof structuredClone === 'function'
                    ? structuredClone(initialValue)
                    : /* c8 ignore next 1 */
                      Object.assign(Object.create(null), initialValue)
                : initialValue,
            ];
            /* c8 ignore next 4 */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return [e, initialValue];
          }
        }),
      ),
    );
  }

  mapAsObject(cb) {
    return Object.fromEntries(Array.prototype.map.call(this, (e) => [e, cb(e)]));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toRecordType(type = 'any', initialValue = undefined, ...records) {
    return Object.assign(
      {},
      ...records,
      Object.fromEntries(
        Array.prototype.map.call(this, (e) => {
          try {
            return [
              e,
              typeof initialValue === 'object' && initialValue !== null
                ? Array.isArray(initialValue)
                  ? [...initialValue]
                  : typeof structuredClone === 'function'
                    ? structuredClone(initialValue)
                    : /* c8 ignore next 1 */
                      { ...initialValue }
                : initialValue,
            ];
            /* c8 ignore next 4 */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return [e, initialValue];
          }
        }),
      ),
    );
  }

  asMap() {
    return new Map(Object.entries(this.enum));
  }

  asSet() {
    return new Set(Array.from(this));
  }

  asObject() {
    return Object.assign({}, this.enum);
  }

  // Methods returning the native array
  map() {
    return Array.prototype.map.apply(Array.from(this), arguments);
  }

  filter() {
    return Array.prototype.filter.apply(Array.from(this), arguments);
  }

  reduce() {
    return Array.prototype.reduce.apply(Array.from(this), arguments);
  }

  reduceRight() {
    return Array.prototype.reduceRight.apply(Array.from(this), arguments);
  }

  flat() {
    return Array.prototype.flat.apply(Array.from(this), arguments);
  }

  flatMap() {
    return Array.prototype.flatMap.apply(Array.from(this), arguments);
  }

  with() {
    return Array.prototype.with.apply(Array.from(this), arguments);
  }

  push() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('push'));
    }
    /* c8 ignore stop */

    if (!Object.isFrozen(this)) {
      Array.prototype.push.apply(this, arguments);
      // incremental: a full rebuild makes push O(n) and loops O(n²)
      for (let i = 0; i < arguments.length; i++) {
        this.enum[arguments[i]] = arguments[i];
      }
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }

    return this.length;
  }

  shift() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('shift'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      const shifted = Array.prototype.shift.apply(this, arguments);

      // rebuild from remaining elements: the shifted value may be duplicated
      this.enum = Object.fromEntries(Array.prototype.map.call(this, (e) => [e, e]));

      return shifted;
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
  }

  unshift() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('unshift'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      Array.prototype.unshift.apply(this, arguments);

      for (let i = 0; i < arguments.length; i++) {
        this.enum[arguments[i]] = arguments[i];
      }
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
    return this.length;
  }

  copyWithin() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('copyWithin'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      Array.prototype.copyWithin.apply(this, Array.from(arguments));

      this.enum = Object.fromEntries(Array.prototype.map.call(this, (e) => [e, e]));
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
    return this;
  }

  pop() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('pop'));
    }
    /* c8 ignore stop */

    if (!Object.isFrozen(this)) {
      const popped = super.pop();

      this.enum = Object.fromEntries(Array.prototype.map.call(this, (e) => [e, e]));

      return popped;
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
  }

  fill() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('fill'));
    }
    /* c8 ignore stop */

    if (!Object.isFrozen(this)) {
      Array.prototype.fill.apply(this, arguments);

      this.enum = Object.fromEntries(Array.prototype.map.call(this, (e) => [e, e]));
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }

    return this;
  }

  splice() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('splice'));
    }

    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      const spliced = s.splice.apply(s, arguments);
      super.splice.apply(this, arguments);

      this.enum = Object.fromEntries(Array.prototype.map.call(this, (e) => [e, e]));

      return spliced;
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
  }

  reverse() {
    /* c8 ignore start */
    if (shouldWarn) {
      console.warn(mutationWarning('reverse'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      Array.prototype.reverse.apply(this, arguments);
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
    return this;
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
  reverse: 'reverse',
});
