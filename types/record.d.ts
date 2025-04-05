/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="./index.d.ts" />

declare global {
  namespace StringLiteralList {}
  namespace StringLiteralList.record {
    export type StringRecord<T extends string, S extends unknown> = Record<T, S>;

    export type Merge<Records extends Record<string, any>[]> = Records extends [
      infer A extends Record<string, any>,
      infer B extends Record<string, any>,
      ...infer Rest extends Record<string, any>[],
    ]
      ? Merge<[A & Omit<B, keyof A>, ...Rest]>
      : Records extends [infer A]
        ? A
        : unknown;
  }
}

export {};
