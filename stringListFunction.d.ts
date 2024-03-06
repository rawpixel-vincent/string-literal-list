import { IStringList } from './StringLiteralList.js';

export function stringListMutable<TT extends readonly string[] = readonly never[]>(...list: TT): IStringList<TT[number]>;

export function stringListReadonly<TT extends readonly string[] = readonly never[]>(...list: TT): IStringList<TT[number], true>;
