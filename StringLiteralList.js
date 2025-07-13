const freezeIfImmutable = (source, target) => {
  if (source && target && Object.isFrozen(source)) {
    /* c8 ignore next 3 @preserve */
    return Object.freeze(target);
  }
  return target;
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
      const size = 2000;
      for (let i = 0; i < arr.length; i += size) {
        const chunk = Array.prototype.slice
          .call(arr, i, i + size)
          .filter((e) => typeof e === 'string' || typeof e === 'number')
          .map((e) => String(e));
        Array.prototype.push.apply(this, chunk);
        Object.assign(this.enum, Object.fromEntries(chunk.map((e) => [e, e])));
      }
    }

    Object.defineProperty(this, 'enum', {
      writable: true,
      configurable: false,
      enumerable: false,
    });
  }

  includes(searchElement, fromIndex = 0) {
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
      new SL(Array.prototype.toSorted.apply(this, arguments)),
    );
  }

  toReversed() {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.toReversed.apply(this, arguments)),
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
      new SL(Array.prototype.slice.apply(Array.from(this), arguments)),
    );
  }

  without(...values) {
    return freezeIfImmutable(
      this,
      new SL(
        Array.prototype.filter.call(
          this,
          (e) =>
            !values.find((v) =>
              Array.isArray(v)
                ? v.find((ve) => e === (typeof ve === 'number' ? String(ve) : ve)) !==
                  undefined
                : e === (typeof v === 'number' ? String(v) : v),
            ),
        ),
      ),
    );
  }

  pick(...values) {
    /* c8 ignore start */
    if (values.length === 0) {
      return this;
    }
    /* c8 ignore stop */

    return freezeIfImmutable(
      this,
      new SL(
        Array.prototype.filter.call(this, (v) =>
          values.find((e) => v === (typeof e === 'number' ? String(e) : e)),
        ),
      ),
    );
  }

  withTrim() {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.map.call(this, (e) => e.trim())),
    );
  }

  withPrefix(prefix = '') {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.map.call(this, (e) => `${prefix}${e}`)),
    );
  }

  withSuffix(suffix = '') {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.map.call(this, (e) => `${e}${suffix}`)),
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
      new SL(Array.prototype.map.call(this, (e) => e.replace(string, replacement))),
    );
  }

  withReplaceAll(string, replacement = undefined) {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.map.call(this, (e) => e.replaceAll(string, replacement))),
    );
  }

  toLowerCase() {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.map.call(this, (e) => e.toLowerCase())),
    );
  }

  toUpperCase() {
    return freezeIfImmutable(
      this,
      new SL(Array.prototype.map.call(this, (e) => e.toUpperCase())),
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
      this.enum = Object.fromEntries(Array.prototype.map.call(this, (e) => [e, e]));
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

      this.enum = Object.fromEntries(
        Object.entries(this.enum).filter(([e]) => e !== shifted),
      );

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

      this.enum = Object.assign(
        Object.create(null),
        this.enum,
        Object.fromEntries(Array.from(arguments).map((e) => [e, e])),
      );
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
