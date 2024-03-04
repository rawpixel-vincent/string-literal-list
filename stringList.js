// @ts-check
/// <reference path="types.d.ts" />

import { SL } from './StringLiteralList.js';

/** @type {import('./stringList.js').stringList} */
export function stringList(...strings) {
  let values = strings;
  if (strings.length && strings.some((el) => typeof el !== 'string')) {
    /* c8 ignore start */
    if (
      typeof window === 'undefined' &&
      process?.env?.NODE_ENV !== 'production' &&
      process?.env?.NODE_ENV !== 'test'
    ) {
      console.debug(
        'Unexpected type in stringList(). Casting all arguments to string type.',
      );
    }
    /* c8 ignore stop */
    values = strings.flatMap((el) =>
      Array.isArray(el)
        ? el.filter((s) => typeof s === 'string').map((s) => s)
        : typeof el === 'string'
          ? [el]
          : [],
    );
  }

  // @ts-expect-error
  return Object.freeze(new SL(...values));
}
