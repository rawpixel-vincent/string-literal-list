// @ts-check
/// <reference types="./types/index.d.ts" />
/// <reference types="./types/list.d.ts" />

import { SL } from './StringLiteralList.js';

export function stringListMutable(...strings) {
  let values = strings;
  let invalid = strings.some((el) => typeof el !== 'string');
  if (strings.length && invalid) {
    /* c8 ignore start */
    if (
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
    ) {
      console.warn(
        `Unexpected type in stringList(${typeof invalid}). Casting all arguments to string type.`,
      );
    }
    /* c8 ignore stop */
    values = strings.flatMap((el) =>
      Array.isArray(el)
        ? el
            .filter((n) => typeof n === 'string' || typeof n === 'number')
            .map((n) => String(n))
        : typeof el === 'string'
          ? [el]
          : typeof el === 'number'
            ? [String(el)]
            : [],
    );
  }
  return new SL(...values);
}

export function stringListReadonly(...strings) {
  return Object.freeze(stringListMutable(...strings));
}
