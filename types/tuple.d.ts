/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types='./index.d.ts' />
/// <reference types='./generic.d.ts' />
/// <reference types='./string.d.ts' />

declare global {
  namespace StringLiteralList {}
  namespace StringLiteralList.tuple {
    export type GetTuplePositiveIndex<T extends readonly any[], I extends number> =
      generic.IsNegative<I> extends false
        ? I
        : generic.Subtract<T['length'], generic.Abs<I>>;

    export type IsStringLiteralArray<Arr extends string[] | readonly string[]> =
      string.IsStringLiteral<Arr[number]> extends true ? true : false;
    /*
     * Takes a union of strings and returns a tuple of them.
     * deprecated this doesn't infer the length and the position of the tuple. It will also drop duplicates.
     */
    // export type UnionToTuple<T extends string> =
    //   generic.UnionToIntersection<
    //     T extends never ? never : T extends string ? (t: T) => T : never
    //   > extends (_: never) => infer W
    //     ? W extends string
    //       ? Exclude<T, W> extends infer TW extends string
    //         ? generic.UnionToIntersection<
    //             TW extends never
    //               ? never
    //               : TW extends string
    //                 ? (t: TW) => TW
    //                 : never
    //           > extends (_: TW) => infer R
    //           ? R extends string
    //             ? Exclude<TW, R> extends infer TR extends string
    //               ? generic.UnionToIntersection<
    //                   TR extends never
    //                     ? never
    //                     : TR extends string
    //                       ? (t: TR) => TR
    //                       : never
    //                 > extends (_: TR) => infer RR
    //                 ? RR extends string
    //                   ? Exclude<TR, RR> extends infer TTR extends string
    //                     ? generic.UnionToIntersection<
    //                         TTR extends never
    //                           ? never
    //                           : TTR extends string
    //                             ? (t: TTR) => TTR
    //                             : never
    //                       > extends (_: TTR) => infer RRR
    //                       ? RRR extends string
    //                         ? Exclude<TTR, RRR> extends infer TTTR extends
    //                             string
    //                           ? generic.UnionToIntersection<
    //                               TTTR extends never
    //                                 ? never
    //                                 : TTTR extends string
    //                                   ? (t: TTTR) => TTTR
    //                                   : never
    //                             > extends (_: TTTR) => infer RRRR
    //                             ? RRRR extends string
    //                               ? readonly [
    //                                   ...UnionToTuple<
    //                                     Exclude<TTTR, W | R | RR | RRR | RRRR>
    //                                   >,
    //                                   RRRR,
    //                                   RRR,
    //                                   RR,
    //                                   R,
    //                                   W,
    //                                 ]
    //                               : never
    //                             : readonly [RRR, RR, R, W]
    //                           : never
    //                         : never
    //                       : readonly [RR, R, W]
    //                     : never
    //                   : never
    //                 : readonly [TW, W]
    //               : never
    //             : never
    //           : readonly [W]
    //         : never
    //       : readonly [T]
    //     : readonly [];

    export type TupleSplit<
      T,
      N extends number,
      O extends readonly any[] = readonly [],
    > = O['length'] extends N
      ? [O, T]
      : T extends readonly [infer F, ...infer R]
        ? TupleSplit<readonly [...R], N, readonly [...O, F]>
        : [O, T];

    export type TupleExplode<T, Exploded extends any[] = []> = T extends readonly [
      infer Head,
      ...infer Rest,
    ]
      ? Head extends readonly []
        ? Exploded
        : Rest extends readonly []
          ? [...Exploded, readonly [Head]]
          : TupleExplode<Rest, [...Exploded, readonly [Head]]>
      : Exploded;

    export type TupleImplode<
      T,
      Imploded extends readonly any[] = readonly [],
    > = T extends readonly [infer Head, ...infer Rest]
      ? Head extends readonly []
        ? Imploded
        : Head extends readonly [...infer Head]
          ? Rest extends readonly []
            ? readonly [...Imploded, ...Head]
            : TupleImplode<Rest, [...Imploded, ...Head]>
          : Imploded
      : Imploded;

    export type TakeFirst<T extends readonly any[], N extends number> = TupleSplit<
      T,
      N
    >[0];

    export type SkipFirst<T extends readonly any[], N extends number> = TupleSplit<
      T,
      N
    >[1];

    export type TupleSlice<
      T extends readonly any[],
      S extends number,
      E extends number,
    > = SkipFirst<TakeFirst<T, E>, S>;

    export type TuplePrefixed<
      T extends readonly string[],
      P extends string,
      Transformed extends readonly string[],
    > = T extends readonly [infer H, ...infer R]
      ? H extends string
        ? R extends readonly string[]
          ? TuplePrefixed<R, P, readonly [...Transformed, `${P}${H}`]>
          : readonly [...Transformed, `${P}${H}`]
        : Transformed
      : Transformed;

    export type TupleSuffixed<
      T extends readonly string[],
      S extends string,
      Transformed extends readonly string[],
    > = T extends readonly [infer H, ...infer R]
      ? H extends string
        ? R extends readonly string[]
          ? TupleSuffixed<R, S, readonly [...Transformed, `${H}${S}`]>
          : readonly [...Transformed, `${H}${S}`]
        : Transformed
      : Transformed;

    export type TupleWithReplace<
      T extends readonly string[],
      Lookup extends string | RegExp,
      Replacement extends string,
      Transformed extends readonly string[],
      All extends boolean = false,
    > = T extends readonly [infer H, ...infer R]
      ? H extends string
        ? R extends readonly string[]
          ? TupleWithReplace<
              R,
              Lookup,
              Replacement,
              readonly [
                ...Transformed,
                [All] extends [false]
                  ? string.Replace<H, Lookup, Replacement>
                  : string.ReplaceAll<H, Lookup, Replacement>,
              ],
              All
            >
          : readonly [
              ...Transformed,
              [All] extends [false]
                ? string.Replace<H, Lookup, Replacement>
                : string.ReplaceAll<H, Lookup, Replacement>,
            ]
        : Transformed
      : Transformed;

    export type TupleWithCaseTransform<
      T extends readonly string[],
      Transform extends 'uppercase' | 'lowercase' | 'capitalize' | 'unCapitalize',
      Transformed extends readonly string[],
    > = T extends readonly [infer H, ...infer R]
      ? H extends string
        ? R extends readonly string[]
          ? TupleWithCaseTransform<
              R,
              Transform,
              readonly [...Transformed, string.CaseTransform<H, Transform>]
            >
          : readonly [...Transformed, string.CaseTransform<H, Transform>]
        : Transformed
      : Transformed;

    export type TupleWithTrim<
      T extends readonly string[],
      Transformed extends readonly string[],
    > = T extends readonly [infer H, ...infer R]
      ? H extends string
        ? R extends readonly string[]
          ? TupleWithTrim<R, readonly [...Transformed, string.Trim<H>]>
          : readonly [...Transformed, string.Trim<H>]
        : Transformed
      : Transformed;

    export type TupleWithExclude<
      T extends readonly string[],
      E extends string,
      Transformed extends readonly string[],
    > = T extends readonly [infer H, ...infer R]
      ? H extends string
        ? R extends readonly string[]
          ? TupleWithExclude<
              R,
              E,
              [H] extends [E] ? Transformed : readonly [...Transformed, H]
            >
          : [H] extends [E]
            ? Transformed
            : readonly [...Transformed, H]
        : Transformed
      : Transformed;

    export type TupleReversed<
      T extends readonly string[],
      Reversed extends readonly string[],
    > = T extends readonly [infer H, ...infer R]
      ? H extends string
        ? R extends readonly string[]
          ? Reversed extends readonly string[]
            ? TupleReversed<readonly [...R], readonly [H, ...Reversed]>
            : readonly [H, ...R]
          : readonly [H]
        : Reversed
      : Reversed;

    export type JoinInner<
      T extends readonly string[],
      delimiter extends string = '',
    > = T extends readonly [
      infer first extends string,
      ...infer rest extends readonly string[],
    ]
      ? rest extends []
        ? first
        : `${first}${delimiter}${JoinInner<rest, delimiter>}`
      : '';

    export type Join<
      T extends readonly string[],
      delimiter extends string = '',
    > = delimiter extends string
      ? T extends readonly string[]
        ? TupleSplit<T, 30> extends [
            infer L extends readonly string[],
            infer R extends readonly string[],
          ]
          ? JoinInner<L, delimiter> extends infer C extends string
            ? `${R['length']}` extends `0`
              ? C
              : R extends readonly string[]
                ? string.Length<`${R['length']}`> extends 1 | 2
                  ? JoinInner<R, delimiter> extends infer D extends string
                    ? `${C}${D}`
                    : Join<readonly [C, ...R], delimiter>
                  : ''
                : ''
            : ''
          : ''
        : never
      : never;

    export type TupleJoin<
      T extends readonly string[],
      Joined extends readonly string[],
    > = T extends readonly [infer A, ...infer Rest]
      ? A extends { infered: { Tuple: readonly string[] } }
        ? Rest extends readonly []
          ? readonly [...Joined, ...A['infered']['Tuple']]
          : Rest extends readonly { infered: { Tuple: readonly string[] } }[]
            ? ILiteralsTupleJoin<Rest, [...Joined, ...A['infered']['Tuple']]>
            : Joined
        : []
      : [];

    export type ILiteralsTupleJoin<
      T extends readonly Partial<{
        infered: Partial<{ Tuple: readonly unknown[] }>;
      }>[],
      Joined extends readonly string[],
    > = T extends readonly [infer A, ...infer Rest]
      ? A extends Partial<{ infered: Partial<{ Tuple: readonly string[] }> }>
        ? Rest extends []
          ? A['infered']['Tuple'] extends infer L extends readonly string[]
            ? readonly [...Joined, ...L]
            : never
          : Rest extends readonly Partial<{
                infered: Partial<{ Tuple: readonly unknown[] }>;
              }>[]
            ? A['infered']['Tuple'] extends infer L extends readonly string[]
              ? ILiteralsTupleJoin<Rest, [...Joined, ...L]>
              : never
            : Joined
        : A extends Partial<{
              infered: Partial<{ Tuple: readonly string[] }>;
            }>
          ? A['infered']['Tuple'] extends infer L extends readonly string[]
            ? [...Joined, ...L]
            : never
          : Rest extends readonly Partial<{
                infered: Partial<{ Tuple: readonly unknown[] }>;
              }>[]
            ? ILiteralsTupleJoin<Rest, Joined>
            : Joined
      : Joined;
  }
}

export {};
