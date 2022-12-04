import fs from 'fs';

const file = fs.readFileSync('./src/04/input.txt').toString();

const lines = file.split('\n');

lines.pop();

type IRange = {
  from: number;
  to: number;
};

const splitted = lines.map((line): IRange[] => {
  const full = line.split(',').map((el) => el.split('-').map((el) => Number(el)));

  return [
    { from: full[0][0], to: full[0][1] },
    { from: full[1][0], to: full[1][1] },
  ];
});

const isRangeIn = (check: IRange, inThis: IRange) => {
  const check1 = check.from >= inThis.from && check.from <= inThis.to;
  const check2 = check.to <= inThis.to && check.to >= inThis.from;
  return check1 && check2;
};

const isOverlap = (check: IRange, inThis: IRange) => {
  const check1 = check.from >= inThis.from && check.from <= inThis.to;
  const check2 = check.to <= inThis.to && check.to >= inThis.from;
  return check1 || check2;
};

const first = splitted.reduce((acc, pairs) => {
  if (isRangeIn(pairs[0], pairs[1]) || isRangeIn(pairs[1], pairs[0])) {
    return acc + 1;
  }

  return acc;
}, 0);

const second = splitted.reduce((acc, pairs) => {
  if (isOverlap(pairs[0], pairs[1]) || isOverlap(pairs[1], pairs[0])) {
    return acc + 1;
  }

  return acc;
}, 0);

const main = () => {
  console.log('first', first);

  console.log('second', second);
};

export default main;
