import { IStringList } from './types/list.js';

export function stringList<TT extends readonly string[] = readonly never[]>(
  ...strings: TT
): IStringList<TT[number], TT, true, false>;

export function sl<TT extends readonly string[] = readonly never[]>(
  ...strings: TT
): IStringList<TT[number], TT, true, false>;
