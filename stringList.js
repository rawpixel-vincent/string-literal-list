/// <reference path="types.d.ts" />

import { SL } from './StringLiteralList.js';

/** @type {import('./stringList.js').stringList} */
export function stringList(...strings) {
  if (strings.some((el) => typeof el !== 'string')) {
    throw new Error(`Not a string in stringList ${strings[0]}`);
  }
  // @ts-expect-error[2322]
  return Object.freeze(new SL(...strings));
}
