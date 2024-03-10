/**
 * Describe: SubSet
 */
let tupleFromUnion: StringLiteralList.tuple.UnionToTuple<'id' | 'name'>;
// @ts-expect-error
tupleFromUnion = ['name', 'id'];
// @ts-expect-no-error
tupleFromUnion = ['id', 'name'];
// @ts-expect-error
tupleFromUnion = ['id'];
// @ts-expect-error
tupleFromUnion = ['name'];
// @ts-expect-error
tupleFromUnion = 'id';

let tupleFromUnionJoined: StringLiteralList.tuple.Join<
  StringLiteralList.tuple.UnionToTuple<'id' | 'name'>
>;
// @ts-expect-error
tupleFromUnionJoined = 'id name';
// @ts-expect-no-error
tupleFromUnionJoined = 'idname';
// @ts-expect-error
tupleFromUnionJoined = 'nameid';

let withoutSuffix: StringLiteralList.string.DropSuffix<'name.json', '.json'>;
// @ts-expect-error
withoutSuffix = 'name.json';
// @ts-expect-no-error
withoutSuffix = 'name';
// @ts-expect-error
withoutSuffix = '';

let withoutPrefix: StringLiteralList.string.DropPrefix<'name.json', 'name.'>;
// @ts-expect-error
withoutPrefix = 'name.json';
// @ts-expect-no-error
withoutPrefix = 'json';
// @ts-expect-error
withoutPrefix = '';

let withReplace: StringLiteralList.string.Replace<'name.json', '.json', ''>;
// @ts-expect-error
withReplace = 'name.json';
// @ts-expect-no-error
withReplace = 'name';
// @ts-expect-error
withReplace = '';

let withReplaceAll: StringLiteralList.string.ReplaceAll<
  'name.json.json',
  '.json',
  ''
>;
// @ts-expect-error
withReplaceAll = 'name.json.json';
// @ts-expect-no-error
withReplaceAll = 'name';
// @ts-expect-error
withReplaceAll = '';
// @ts-expect-error
withReplaceAll = 'name.json';

let tuple: readonly ['a', 'b', 'c', 'd', 'e'];
let emptyTuple: never[];
let tupleExploded: StringLiteralList.tuple.TupleExplode<typeof tuple>;
// @ts-expect-no-error
tupleExploded = [['a'], ['b'], ['c'], ['d'], ['e']];
// @ts-expect-error
tupleExploded = [['a', 'b'], ['c'], ['d'], ['e']];
// @ts-expect-error
tupleExploded = [['b'], ['a'], ['c'], ['e']];

let tupleImplode: StringLiteralList.tuple.TupleImplode<typeof tupleExploded>;
// @ts-expect-error
tupleImplode = ['b', 'a', 'c', 'd', 'e'];
// @ts-expect-no-error
tupleImplode = tuple;

let prefixedTuple: StringLiteralList.tuple.TuplePrefixed<
  typeof tuple,
  'data.',
  []
>;
// @ts-expect-no-error
prefixedTuple = ['data.a', 'data.b', 'data.c', 'data.d', 'data.e'];
// @ts-expect-error
prefixedTuple = ['a', 'b', 'c', 'd', 'e'];
// @ts-expect-error
prefixedTuple = ['data.a', 'data.c', 'data.b', 'data.d', 'data.e'];

let prefixedEmptyTuple: StringLiteralList.tuple.TuplePrefixed<
  typeof emptyTuple,
  'data.',
  []
>;
// @ts-expect-no-error
prefixedEmptyTuple = [];
// @ts-expect-error
prefixedEmptyTuple = [undefined];
// @ts-expect-error
prefixedEmptyTuple = [...['']];

let suffixedTuple: StringLiteralList.tuple.TupleSuffixed<
  typeof tuple,
  '.json',
  []
>;
// @ts-expect-no-error
suffixedTuple = ['a.json', 'b.json', 'c.json', 'd.json', 'e.json'];
// @ts-expect-error
suffixedTuple = ['a', 'b', 'c', 'd', 'e'];
// @ts-expect-error
suffixedTuple = ['a.json', 'c.json', 'b.json', 'd.json', 'e.json'];

let suffixedEmptyTuple: StringLiteralList.tuple.TupleSuffixed<
  typeof emptyTuple,
  '.json',
  []
>;
// @ts-expect-no-error
suffixedEmptyTuple = [];
// @ts-expect-error
suffixedEmptyTuple = [undefined];
// @ts-expect-error
suffixedEmptyTuple = [...['']];

let tupleWithout: StringLiteralList.tuple.TupleWithExclude<
  typeof tuple,
  'a' | 'b',
  []
>;
// @ts-expect-no-error
tupleWithout = ['c', 'd', 'e'];
// @ts-expect-error
tupleWithout = ['c', 'd'];
// @ts-expect-error
tupleWithout = ['c', 'e', 'd'];
// @ts-expect-error
tupleWithout = [];

let tupleWithUppercase: StringLiteralList.tuple.TupleWithCaseTransform<
  typeof tuple,
  'uppercase',
  []
>;
// @ts-expect-no-error
tupleWithUppercase = ['A', 'B', 'C', 'D', 'E'];
// @ts-expect-error
tupleWithUppercase = ['a', 'b', 'c', 'd', 'e'];

let tupleWithoutEmpty: StringLiteralList.tuple.TupleWithExclude<
  ['', 'd'],
  '',
  []
>;
// @ts-expect-no-error
tupleWithoutEmpty = ['d'];
// @ts-expect-error
tupleWithoutEmpty = ['', 'd'];
// @ts-expect-error
tupleWithoutEmpty = [''];
// @ts-expect-error
tupleWithoutEmpty = ['d', ''];

let tupleWithCapitalize: StringLiteralList.tuple.TupleWithCaseTransform<
  ['title', 'news room'],
  'capitalize',
  []
>;
// @ts-expect-no-error
tupleWithCapitalize = ['Title', 'News Room'];
// @ts-expect-error
tupleWithCapitalize = ['title', 'news room'];
// @ts-expect-error
tupleWithCapitalize = ['News Room', 'Title'];

let tupleWithUnCapitalize: StringLiteralList.tuple.TupleWithCaseTransform<
  ['Title', 'News ROOm'],
  'unCapitalize',
  []
>;
// @ts-expect-no-error
tupleWithUnCapitalize = ['title', 'news rOOm'];
// @ts-expect-error
tupleWithUnCapitalize = ['Title', 'News ROOm'];
// @ts-expect-error
tupleWithUnCapitalize = ['news rOOm', 'title'];

let tupleWithLowercase: StringLiteralList.tuple.TupleWithCaseTransform<
  ['TITLE', 'NEWS ROOM'],
  'lowercase',
  []
>;
// @ts-expect-no-error
tupleWithLowercase = ['title', 'news room'];
// @ts-expect-error
tupleWithLowercase = ['TITLE', 'NEWS ROOM'];
// @ts-expect-error
tupleWithLowercase = ['News Room', 'Title'];

let tupleWithSnakeCase: StringLiteralList.tuple.TupleWithCaseTransform<
  ['titleGap', 'news room'],
  'snakeCase',
  []
>;
// @ts-expect-no-error
tupleWithSnakeCase = ['title_gap', 'news_room'];
// @ts-expect-error
tupleWithSnakeCase = ['titleGap', 'news room'];

let tupleWithCamelCase: StringLiteralList.tuple.TupleWithCaseTransform<
  ['title_flow', 'News_Room'],
  'camelCase',
  []
>;
// @ts-expect-no-error
tupleWithCamelCase = ['titleFlow', 'newsRoom'];
// @ts-expect-error
tupleWithCamelCase = ['title_flow', 'News_Room'];
// @ts-expect-error
tupleWithCamelCase = ['newsRoom', 'titleFlow'];

let tupleWithPascalCase: StringLiteralList.tuple.TupleWithCaseTransform<
  ['title_flow', 'news room'],
  'pascalCase',
  []
>;
// @ts-expect-no-error
tupleWithPascalCase = ['TitleFlow', 'NewsRoom'];
// @ts-expect-error
tupleWithPascalCase = ['title_flow', 'news room'];
// @ts-expect-error
tupleWithPascalCase = ['newsRoom', 'TitleFlow'];

let tupleWithTrim: StringLiteralList.tuple.TupleWithTrim<
  ['  title  ', '  news room  '],
  []
>;
// @ts-expect-no-error
tupleWithTrim = ['title', 'news room'];
// @ts-expect-error
tupleWithTrim = ['  title  ', '  news room  '];
// @ts-expect-error
tupleWithTrim = ['title', 'news room  '];

let tupleReversed: StringLiteralList.tuple.TupleReversed<typeof tuple, []>;
// @ts-expect-no-error
tupleReversed = ['e', 'd', 'c', 'b', 'a'];
// @ts-expect-error
tupleReversed = ['e', 'd', 'c', 'b'];
// @ts-expect-error
tupleReversed = ['e', 'd', 'c', 'a'];
// @ts-expect-error
tupleReversed = [];
