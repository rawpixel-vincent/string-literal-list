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

const shouldWarn = () => {
  /* c8 ignore start */
  return (
    typeof console === 'object' &&
    console &&
    typeof console.warn === 'function' &&
    ((typeof window === 'undefined' &&
      typeof process === 'object' &&
      process &&
      typeof process.env === 'object' &&
      process.env &&
      typeof process.env.NODE_ENV === 'string' &&
      process.env.NODE_ENV &&
      process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test') ||
      (typeof window === 'object' &&
        window &&
        '__NEXT_DATA__' in window &&
        typeof window.__NEXT_DATA__ === 'object' &&
        window.__NEXT_DATA__ &&
        'runtimeConfig' in window.__NEXT_DATA__ &&
        typeof window.__NEXT_DATA__.runtimeConfig === 'object' &&
        window.__NEXT_DATA__.runtimeConfig &&
        'environment' in window.__NEXT_DATA__.runtimeConfig &&
        typeof window.__NEXT_DATA__.runtimeConfig.environment === 'string' &&
        window.__NEXT_DATA__.runtimeConfig.environment !== 'prod'))
  );
  /* c8 ignore stop */
};

export class SL extends Array {
  // #infered = {
  //   Union: undefined,
  //   Tuple: undefined,
  //   Mutable: undefined,
  //   Unsorted: undefined,
  // };

  enum;

  constructor(...args) {
    const entries = [];
    const arr = [];

    for (const str of args.flat()) {
      if (typeof str === 'string') {
        entries.push([str, str]);
        arr.push(str);
      }
    }
    super(...arr);

    this.enum = Object.fromEntries(entries);

    Object.freeze(this.enum);
    Object.defineProperty(this, 'enum', {
      writable: true,
      configurable: false,
      enumerable: false,
    });
  }

  includes(searchElement, fromIndex = 0) {
    if (this.length === 0) {
      return false;
    }
    if (
      fromIndex !== 0 &&
      typeof fromIndex === 'number' &&
      (fromIndex > 0 || fromIndex >= this.length * -1)
    ) {
      return super.includes(searchElement, fromIndex);
    }

    return typeof this.enum[searchElement] === 'string';
  }

  concat(...args) {
    return freezeIfImmutable(this, new SL(...super.concat.apply(this, args.flat())));
  }

  concatList(list) {
    return this.concat(...list);
  }

  toSorted() {
    return freezeIfImmutable(this, new SL(...super.toSorted.apply(this, arguments)));
  }

  toReversed() {
    return freezeIfImmutable(this, new SL(...super.toReversed.apply(this, arguments)));
  }

  toSpliced() {
    return freezeIfImmutable(this, new SL(...super.toSpliced.apply(this, arguments)));
  }

  slice() {
    return freezeIfImmutable(this, new SL(...super.slice.apply(this, arguments)));
  }

  without(...values) {
    const filtered = values
      .flat()
      .map((e) =>
        typeof e === 'string' ? e : typeof e === 'number' ? String(e) : undefined,
      );
    return freezeIfImmutable(this, new SL(...this.filter((e) => !filtered.includes(e))));
  }

  withTrim() {
    return freezeIfImmutable(this, new SL(...super.map((e) => e.trim())));
  }

  withPrefix(prefix = '') {
    return freezeIfImmutable(this, new SL(...super.map((e) => `${prefix}${e}`)));
  }

  withSuffix(suffix = '') {
    return freezeIfImmutable(this, new SL(...super.map((e) => `${e}${suffix}`)));
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
    return freezeIfImmutable(this, new SL(...super.map((e) => e.toLowerCase())));
  }

  toUpperCase() {
    return freezeIfImmutable(this, new SL(...super.map((e) => e.toUpperCase())));
  }

  toCapitalize() {
    return this.withReplace(/\b\w/g, (char) => char.toUpperCase());
  }

  toUnCapitalize() {
    return this.withReplace(/\b\w/g, (char) => char.toLowerCase());
  }

  value(value) {
    if (typeof value !== 'string') {
      throw new Error(`Invalid value ${value}`);
    }
    if (this.enum[value] === value) {
      return this.enum[value];
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
      Object.fromEntries(
        super.map((e) => {
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

  mapAsObject(cb) {
    return Object.fromEntries(super.map((e) => [e, cb(e)]));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toRecordType(type = 'any', initialValue = undefined, ...records) {
    return Object.assign(
      {},
      ...records,
      Object.fromEntries(
        super.map((e) => {
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
    return new Map(super.map((e) => [e, e]));
  }

  asSet() {
    return new Set(this);
  }

  asObject() {
    return Object.assign({}, ...super.map((e) => ({ [e]: e })));
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

  push() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('push'));
    }
    /* c8 ignore stop */

    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      s.push.apply(s, arguments);
      super.push.apply(this, arguments);

      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }

    return this.length;
  }

  shift() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('shift'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      const shifted = s.shift.apply(s, arguments);
      super.shift.apply(this, arguments);

      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);

      return shifted;
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
  }

  unshift() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('unshift'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      s.unshift.apply(s, arguments);
      super.unshift.apply(this, arguments);

      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
    return this.length;
  }

  copyWithin() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('copyWithin'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      s.copyWithin.apply(s, arguments);
      super.copyWithin.apply(this, arguments);

      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
    return this;
  }

  pop() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('pop'));
    }
    /* c8 ignore stop */

    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      const popped = s.pop.apply(s, arguments);
      super.pop.apply(this, arguments);

      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);

      return popped;
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
  }

  fill() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('fill'));
    }
    /* c8 ignore stop */

    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      s.fill.apply(s, arguments);
      super.fill.apply(this, arguments);

      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }

    return this;
  }

  splice() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('splice'));
    }

    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      const spliced = s.splice.apply(s, arguments);
      super.splice.apply(this, arguments);

      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);

      return spliced;
    } else {
      throw new Error('Cannot set properties on a frozen object');
    }
  }

  reverse() {
    /* c8 ignore start */
    if (shouldWarn()) {
      console.warn(mutationWarning('reverse'));
    }
    /* c8 ignore stop */
    if (!Object.isFrozen(this)) {
      const s = this.mutable();
      s.reverse.apply(s, arguments);
      super.reverse.apply(this, arguments);
      this.enum = Object.fromEntries(this.map((e) => [e, e]));

      Object.freeze(this.enum);
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
