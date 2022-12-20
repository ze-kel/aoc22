import fs from 'fs';
import { log, time, timeEnd } from 'console';

const numbers = fs
  .readFileSync('./src/20/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length)
  .map((el) => {
    return Number(el);
  });

const initialOrder = numbers.map((n, i) => {
  return { v: n, id: i };
});

const getPosition = (length: number, pos: number, move: number) => {
  let target = pos + move;

  if (target < 0) {
    const loopTimes = Math.ceil(-target / (length - 1));
    target += (length - 1) * loopTimes;
  }
  if (target > initialOrder.length - 1) {
    const loopTimes = Math.floor(target / (length - 1));
    target -= (length - 1) * loopTimes;
  }
  return target;
};

const move = (arr: any[], id: number, move: number) => {
  const pos = arr.findIndex((el) => {
    return el.id === id;
  });

  let target = getPosition(arr.length, pos, move);

  const el = arr.splice(pos, 1);
  arr.splice(target, 0, el[0]);
};

const wrappedIndexIntem = (arr, i) => {
  let pointer = arr.findIndex((el) => el.v === 0);
  // yes this is bad, yes i made it like that
  // gigachad.jpg
  for (i; i > 0; i--) {
    pointer++;
    if (pointer > arr.length - 1) {
      pointer = 0;
    }
  }
  return arr[pointer];
};

const first = () => {
  const moveable = [...initialOrder];

  initialOrder.forEach((n, i) => {
    move(moveable, i, n.v);
  });

  const k1 = wrappedIndexIntem(moveable, 1000).v;
  const k2 = wrappedIndexIntem(moveable, 2000).v;
  const k3 = wrappedIndexIntem(moveable, 3000).v;

  log('first', k1 + k2 + k3);
};

const second = () => {
  const newOrder = initialOrder.map(({ v, id }) => {
    return { v: v * 811589153, id };
  });
  const moveable = [...newOrder];

  for (let i = 0; i < 10; i++) {
    newOrder.forEach((n, i) => {
      move(moveable, i, n.v);
    });
  }

  const k1 = wrappedIndexIntem(moveable, 1000).v;
  const k2 = wrappedIndexIntem(moveable, 2000).v;
  const k3 = wrappedIndexIntem(moveable, 3000).v;

  log('second', k1 + k2 + k3);
};

const main = () => {
  first();
  second();
};

export default main;
