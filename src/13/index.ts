import fs from 'fs';
import { log } from 'console';
const pairs = fs
  .readFileSync('./src/13/input.txt')
  .toString()
  .split('\n\n')
  .map((el) =>
    el
      .split('\n')
      .filter((el) => el.length)
      .map((el) => JSON.parse(el))
  );

const singles = fs
  .readFileSync('./src/13/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length)
  .map((el) => JSON.parse(el));

type List = List[] | number;

const processPair = (left: List, right: List) => {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left === right) return 'same';
    return left < right;
  }

  if (typeof left === 'number') left = [left];
  if (typeof right === 'number') right = [right];

  for (let i = 0; i < left.length; i++) {
    if (right[i] === undefined) return false;
    const compare = processPair(left[i], right[i]);
    if (compare !== 'same') return compare;
  }

  if (left.length === right.length) return 'same';
  return left.length < right.length;
};

const main = () => {
  const statuses = pairs.map((pair) => processPair(pair[0], pair[1]));

  const first = statuses.reduce((acc, el, index) => {
    if (el === 'same') log('same');
    if (!el) return acc;
    return acc + index + 1;
  }, 0);
  console.log('first', first);

  const secondWithD = [...singles, [[2]], [[6]]];

  secondWithD.sort((a, b) => {
    return processPair(a, b) === true ? -1 : 1;
  });

  const d1 = secondWithD.findIndex((l) => JSON.stringify(l) === JSON.stringify([[2]])) + 1;
  const d2 = secondWithD.findIndex((l) => JSON.stringify(l) === JSON.stringify([[6]])) + 1;
  log('second', d1 * d2);
};

export default main;
