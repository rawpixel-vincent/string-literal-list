export declare function stringList<
  TT extends readonly string[] = readonly never[],
>(...strings: TT): StringLiteralList.list.IStringList<TT, false, false>;

export declare function sl<TT extends readonly string[] = readonly never[]>(
  ...strings: TT
): StringLiteralList.list.IStringList<TT, false, false>;
