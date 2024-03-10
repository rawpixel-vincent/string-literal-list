/// <reference path="./types/index.d.ts" />
/// <reference path="./types/list.d.ts" />

import { IStringList } from './types/list.js';

export function stringListMutable<
  TT extends readonly string[] = readonly never[],
>(...list: TT): IStringList<TT[number], TT, true, false>;

export function stringListReadonly<
  TT extends readonly string[] = readonly never[],
>(...list: TT): IStringList<TT[number], TT, false, false>;
