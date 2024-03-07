import { IStringList } from './StringLiteralList.js';

export function stringList<TT extends readonly string[] = readonly never[]>(
  ...strings: TT
): IStringList<TT[number], TT>;
