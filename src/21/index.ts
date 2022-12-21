import fs from 'fs';
import { log, time, timeEnd } from 'console';
import cloneDeep from 'lodash/cloneDeep.js';

type Element = {
  name: string;
  value: number | null;
  calc?: {
    a: string;
    b: string;
    operation: string;
  };
  in: Element[];
};

const numbersArr = fs
  .readFileSync('./src/21/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length)
  .map((el) => {
    const spl = el.split(': ');
    const name = spl[0];
    const content: Element = { value: null, name, in: [] };

    const spl2 = spl[1].split(' ');
    if (spl2.length === 1) {
      content.value = Number(spl2[0]);
    } else {
      content.calc = {
        a: spl2[0],
        operation: spl2[1],
        b: spl2[2],
      };
    }
    return content;
  });

const solve = (nums, id: string) => {
  const n = nums[id];

  if (n.value !== null) {
    return n.value;
  }

  const a = solve(nums, n.calc.a);
  const b = solve(nums, n.calc.b);

  const resolved = eval(`${a} ${n.calc.operation} ${b}`);
  n.value = resolved;
  return resolved;
};

const freshCopy = () => {
  const arr = cloneDeep(numbersArr);
  const nums: Record<string, Element> = {};

  arr.forEach((n) => {
    nums[n.name] = n;
  });
  return nums;
};

const first = () => {
  const nums = freshCopy();
  const r = solve(cloneDeep(nums), 'root');
  log('first', r);
};

const preSolve = (nums, id: string) => {
  if (id === 'humn') {
    return null;
  }
  const n: Element = nums[id];

  if (n.value !== null) {
    return n.value;
  }

  const a = preSolve(nums, n.calc.a);
  const b = preSolve(nums, n.calc.b);

  if (a !== null && b !== null) {
    const res = eval(`${a} ${n.calc.operation} ${b}`);
    n.value = res;
    return res;
  }

  return null;
};
const reverseSolve = (nums, id: string, valToMatch: number) => {
  if (id === 'humn') {
    return valToMatch;
  }
  const n = nums[id];

  const a: Element = nums[n.calc.a];
  const b: Element = nums[n.calc.b];

  if (a.value !== null) {
    let newVal = 0;
    switch (n.calc.operation) {
      case '+':
        newVal = valToMatch - a.value;
        break;
      case '-':
        newVal = a.value - valToMatch;
        break;
      case '*':
        newVal = valToMatch / a.value;
        break;
      case '/':
        newVal = a.value / valToMatch;
        break;
    }
    return reverseSolve(nums, b.name, newVal);
  }

  if (b.value !== null) {
    let newVal = 0;
    switch (n.calc.operation) {
      case '+':
        newVal = valToMatch - b.value;
        break;
      case '-':
        newVal = b.value + valToMatch;
        break;
      case '*':
        newVal = valToMatch / b.value;
        break;
      case '/':
        newVal = b.value * valToMatch;
        break;
    }
    return reverseSolve(nums, a.name, newVal);
  }
};

const second = () => {
  const nums = freshCopy();
  preSolve(nums, 'root');

  // I pre checked that this is not dependent on our num
  const right = solve(nums, nums.root.calc.b);

  const left = reverseSolve(nums, nums.root.calc.a, right);
  log('second', left);
};

const main = () => {
  first();
  second();
};

export default main;
