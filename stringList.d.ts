import { IStringList } from './StringLiteralList.js';

export function stringList<T extends string>(
  ...strings: T[]
): Readonly<IStringList<Record<T, T>[T]>>;
