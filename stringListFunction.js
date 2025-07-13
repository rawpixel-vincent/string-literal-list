// @ts-check
/// <reference types="./types/index.d.ts" />
/// <reference types="./types/list.d.ts" />

import { SL } from './StringLiteralList.js';
/* c8 ignore start */
const warn =
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

export function stringListMutable() {
  /* c8 ignore start */
  const values =
    arguments.length > 0
      ? Array.isArray(arguments[0])
        ? arguments[0]
        : arguments.length
          ? Array.from(arguments)
          : []
      : [];
  /* c8 ignore stop */
  /* c8 ignore start */
  if (warn) {
    let invalid = values.some((el) => typeof el !== 'string');
    if (values.length && invalid) {
      console.warn(
        `Unexpected type in stringList(${typeof invalid}). Casting all arguments to string type.`,
      );
    }
  }
  /* c8 ignore stop */
  // @ts-expect-error - passing array to SL constructor for performance
  return new SL(values);
}

export function stringListReadonly() {
  /* c8 ignore start */
  const values =
    arguments.length > 0
      ? Array.isArray(arguments[0])
        ? arguments[0]
        : arguments.length
          ? Array.from(arguments)
          : []
      : [];
  /* c8 ignore stop */
  /* c8 ignore start */
  if (warn) {
    let invalid = values.some((el) => typeof el !== 'string');
    if (values.length && invalid) {
      console.warn(
        `Unexpected type in stringList(${typeof invalid}). Casting all arguments to string type.`,
      );
    }
  }
  /* c8 ignore stop */
  // @ts-expect-error - passing array to SL constructor for performance
  return Object.freeze(new SL(values));
}
