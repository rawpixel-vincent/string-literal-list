import { IStringList } from './StringLiteralList.js';

export function stringList<T extends string = never>(
  ...strings: T[]
): IStringList<Record<T, T>[T]>;
