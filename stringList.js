// @ts-check
/// <reference path="types.d.ts" />

import { SL } from './StringLiteralList.js';

/** @type {import('./stringList.js').stringList} */
export function stringList(...strings) {
  let values = strings;
  let invalid = strings.some((el) => typeof el !== 'string');
  if (strings.length && invalid) {
    /* c8 ignore start */
    if (
      typeof window === 'undefined' &&
      process?.env?.NODE_ENV !== 'production' &&
      process?.env?.NODE_ENV !== 'test'
    ) {
      console.debug(
        `Unexpected type in stringList(${typeof invalid}). Casting all arguments to string type.`,
      );
    }
    /* c8 ignore stop */
    values = strings.flatMap((el) =>
      Array.isArray(el)
        ? el.filter((s) => typeof s === 'string')
        : typeof el === 'string'
          ? [el]
          : typeof el === 'number'
            ? [String(el)]
            : [],
    );
  }

  // @ts-expect-error
  return Object.freeze(new SL(...values));
}
