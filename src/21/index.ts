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

const nums: Record<string, Element> = {};

numbersArr.forEach((n) => {
  nums[n.name] = n;
});

numbersArr.forEach((n) => {
  if (n.calc) {
    nums[n.calc.a].in.push(n);
    nums[n.calc.b].in.push(n);
  }
});

const solve = (nums, id: string, second = false) => {
  const n = nums[id];

  if (n.value) {
    return n.value;
  }

  const a = solve(nums, n.calc.a);
  const b = solve(nums, n.calc.b);

  if (id === 'root') {
    return a === b;
  }

  const resolved = eval(`${a} ${n.calc.operation} ${b}`);
  n.value = resolved;
  return resolved;
};

const first = () => {
  const r = solve(cloneDeep(nums), 'root');
  log('1', r);
};

const second = () => {
  for (let i = 0; i < 1; i++) {
    const n = cloneDeep(nums);
    log(n.humn);
    n['humn'].value = -100000000;
    const r = solve(n, 'root', true);
    const depA = n.root.calc.a;
    const depB = n.root.calc.b;
    log(`for i${i} a ${n[depA].value} b ${n[depB].value}`);
    if (r) {
      log('second', i);
      return;
    }
  }
  log('second fail');
};

const main = () => {
  first();
  second();
};

export default main;
