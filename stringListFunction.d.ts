/// <reference path="./types/index.d.ts" />
/// <reference path="./types/list.d.ts" />

export declare function stringListMutable<
  TT extends readonly string[] = readonly never[],
>(
  ...list: TT
): StringLiteralList.list.IStringList<readonly [...TT], true, false>;

export declare function stringListReadonly<
  TT extends readonly string[] = readonly never[],
>(
  ...list: TT
): StringLiteralList.list.IStringList<readonly [...TT], false, false>;
