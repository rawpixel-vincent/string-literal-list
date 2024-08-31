// @ts-check
/**
 * Describe: SubSet
 */

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

// let tupleFromUnion: StringLiteralList.tuple.UnionToTuple<'id' | 'name'>;
// // @ts-expect-error
// tupleFromUnion = ['name', 'id'];
// // @ts-expect-no-error
// tupleFromUnion = ['id', 'name'];
// // @ts-expect-error
// tupleFromUnion = ['id'];
// // @ts-expect-error
// tupleFromUnion = ['name'];
// // @ts-expect-error
// tupleFromUnion = 'id';

// let tupleFromUnion1: StringLiteralList.tuple.UnionToTuple<'id'>;
// // @ts-expect-no-error
// tupleFromUnion1 = ['id'];

// let tupleFromUnion3: StringLiteralList.tuple.UnionToTuple<
//   'id' | 'name' | 'age'
// >;
// // @ts-expect-no-error
// tupleFromUnion3 = ['id', 'name', 'age'];

// let tupleFromUnion4: StringLiteralList.tuple.UnionToTuple<
//   'id' | 'name' | 'age' | 'height'
// >;
// // @ts-expect-no-error
// tupleFromUnion4 = ['id', 'name', 'age', 'height'];

// let tupleFromUnion5: StringLiteralList.tuple.UnionToTuple<
//   'id' | 'name' | 'age' | 'height' | 'weight'
// >;
// // @ts-expect-no-error
// tupleFromUnion5 = ['id', 'name', 'age', 'height', 'weight'];

// let tupleFromUnion6: StringLiteralList.tuple.UnionToTuple<
//   'id' | 'name' | 'age' | 'height' | 'weight' | 'sight'
// >;
// // @ts-expect-no-error
// tupleFromUnion6 = ['id', 'name', 'age', 'height', 'weight', 'sight'];
// // @ts-expect-error
// tupleFromUnion6 = ['id', 'name', 'height', 'age', 'weight', 'sight'];
// // @ts-expect-error
// tupleFromUnion6 = ['id', 'age', 'name', 'height', 'weight', 'sight'];

// let longTupleUnion: StringLiteralList.tuple.UnionToTuple<
//   | '1'
//   | '2'
//   | '3'
//   | '4'
//   | '5'
//   | '6'
//   | '7'
//   | '8'
//   | '9'
//   | '10'
//   | '11'
//   | '12'
//   | '13'
//   | '14'
//   | '15'
//   | '16'
//   | '17'
//   | '18'
//   | '19'
//   | '20'
//   | '21'
//   | '22'
//   | '23'
//   | '24'
//   | '25'
//   | '26'
//   | '27'
//   | '28'
//   | '29'
//   | '30'
//   | '31'
//   | '32'
//   | '33'
//   | '34'
//   | '35'
//   | '36'
//   | '37'
//   | '38'
//   | '39'
//   | '40'
//   | '41'
//   | '42'
//   | '43'
//   | '44'
//   | '45'
//   | '46'
//   | '47'
//   | '48'
//   | '49'
//   | '50'
//   | '51'
//   | '52'
//   | '53'
//   | '54'
//   | '55'
//   | '56'
//   | '57'
//   | '58'
//   | '59'
//   | '60'
//   | '61'
//   | '62'
//   | '63'
//   | '64'
//   | '65'
//   | '66'
//   | '67'
//   | '68'
//   | '69'
//   | '70'
//   | '71'
//   | '72'
//   | '73'
//   | '74'
//   | '75'
//   | '76'
//   | '77'
//   | '78'
//   | '79'
//   | '80'
//   | '81'
//   | '82'
//   | '83'
//   | '84'
//   | '85'
//   | '86'
//   | '87'
//   | '88'
//   | '89'
//   | '90'
//   | '91'
//   | '92'
//   | '93'
//   | '94'
//   | '95'
//   | '96'
//   | '97'
//   | '98'
//   | '99'
//   | '100'
//   | 'a'
//   | 'b'
//   | 'c'
//   | 'd'
//   | 'e'
//   | 'f'
//   | 'g'
//   | 'h'
//   | 'i'
//   | 'j'
//   | 'k'
//   | 'l'
//   | 'm'
//   | 'n'
//   | 'o'
//   | 'p'
//   | 'q'
//   | 'r'
//   | 's'
//   | 't'
//   | 'u'
//   | 'v'
//   | 'w'
//   | 'x'
//   | 'y'
//   | 'z'
// >;
// // @ts-expect-no-error
// longTupleUnion = [
//   '1',
//   '2',
//   '3',
//   '4',
//   '5',
//   '6',
//   '7',
//   '8',
//   '9',
//   '10',
//   '11',
//   '12',
//   '13',
//   '14',
//   '15',
//   '16',
//   '17',
//   '18',
//   '19',
//   '20',
//   '21',
//   '22',
//   '23',
//   '24',
//   '25',
//   '26',
//   '27',
//   '28',
//   '29',
//   '30',
//   '31',
//   '32',
//   '33',
//   '34',
//   '35',
//   '36',
//   '37',
//   '38',
//   '39',
//   '40',
//   '41',
//   '42',
//   '43',
//   '44',
//   '45',
//   '46',
//   '47',
//   '48',
//   '49',
//   '50',
//   '51',
//   '52',
//   '53',
//   '54',
//   '55',
//   '56',
//   '57',
//   '58',
//   '59',
//   '60',
//   '61',
//   '62',
//   '63',
//   '64',
//   '65',
//   '66',
//   '67',
//   '68',
//   '69',
//   '70',
//   '71',
//   '72',
//   '73',
//   '74',
//   '75',
//   '76',
//   '77',
//   '78',
//   '79',
//   '80',
//   '81',
//   '82',
//   '83',
//   '84',
//   '85',
//   '86',
//   '87',
//   '88',
//   '89',
//   '90',
//   '91',
//   '92',
//   '93',
//   '94',
//   '95',
//   '96',
//   '97',
//   '98',
//   '99',
//   '100',
//   'a',
//   'b',
//   'c',
//   'd',
//   'e',
//   'f',
//   'g',
//   'h',
//   'i',
//   'j',
//   'k',
//   'l',
//   'm',
//   'n',
//   'o',
//   'p',
//   'q',
//   'r',
//   's',
//   't',
//   'u',
//   'v',
//   'w',
//   'x',
//   'y',
//   'z',
// ];

// let tupleFromUnionJoined: StringLiteralList.tuple.Join<
//   StringLiteralList.tuple.UnionToTuple<'id' | 'name'>
// >;
// // @ts-expect-error
// tupleFromUnionJoined = 'id name';
// // @ts-expect-no-error
// tupleFromUnionJoined = 'idname';
// // @ts-expect-error
// tupleFromUnionJoined = 'nameid';
