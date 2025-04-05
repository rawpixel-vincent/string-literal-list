export declare function stringList<TT extends readonly string[] = readonly never[]>(
  ...strings: TT
): StringLiteralList.list.IStringList<readonly [...TT], true, false>;

export declare function sl<TT extends readonly string[] = readonly never[]>(
  ...strings: TT
): StringLiteralList.list.IStringList<readonly [...TT], true, false>;
