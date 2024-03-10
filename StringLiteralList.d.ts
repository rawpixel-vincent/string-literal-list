/// <reference path="./types/index.d.ts" />
/// <reference path="./types/list.d.ts" />

export type ArrayInPlaceMutation = {
  push: 'push';
  unshift: 'unshift';
  shift: 'shift';
  copyWithin: 'copyWithin';
  pop: 'pop';
  fill: 'fill';
  splice: 'splice';
};

export const ARRAY_IN_PLACE_MUTATION: ArrayInPlaceMutation;

/** @type {StringLiteralList.list.IStringList} */
export class SL {
  constructor(...list: string[]);
}
