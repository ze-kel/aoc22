import fs from 'fs';
import _get from 'lodash/get.js';

import { log } from 'console';

const commands = fs
  .readFileSync('./src/18/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length)
  .map((el) => {
    const s = el.split(',');
    return { x: Number(s[0]), y: Number(s[1]), z: Number(s[2]) };
  });

type Coords = { x: number; y: number; z: number };

const get = (map, c: Coords) => {
  return _get(map, `${c.x}.${c.y}.${c.z}`, false);
};

const set = (map, { x, y, z }: Coords, val) => {
  if (!map[x]) {
    map[x] = {};
  }
  if (!map[x][y]) {
    map[x][y] = {};
  }
  map[x][y][z] = val;
};

const getAdjacent = ({ x, y, z }: Coords) => {
  return [
    { x: x + 1, y, z },
    { x: x - 1, y, z },
    { y: y + 1, x, z },
    { y: y - 1, x, z },
    { z: z + 1, x, y },
    { z: z - 1, x, y },
  ];
};

const makeMap = () => {
  const map = {};
  commands.forEach((c) => {
    set(map, c, '1');
  });
  return map;
};

const first = () => {
  const map = makeMap();
  let counter = 0;
  commands.forEach((c) => {
    const adjacent = getAdjacent(c).filter((c) => {
      return get(map, c) === '1';
    });
    counter += 6 - adjacent.length;
  });
  log('first', counter);
};

const max = commands.reduce(
  (acc, c) => {
    return { x: Math.max(acc.x, c.x), y: Math.max(acc.y, c.y), z: Math.max(acc.z, c.z) };
  },
  { x: 0, y: 0, z: 0 }
);
max.x++;
max.y++;
max.z++;

const min = { x: -1, y: -1, z: -1 };

const markOuter = (map) => {
  const q = [{ x: 0, y: 0, z: 0 }];

  let visited = 0;
  while (q.length) {
    const c = q.pop();
    visited++;

    const myVal = get(map, c);
    if (myVal === '1' || myVal === '2') continue;

    set(map, c, '2');

    const adj = getAdjacent(c);

    const filtered = adj.filter((co) => {
      const val = get(map, co);
      if (['1', '2'].includes(val)) return false;

      if (co.x < min.x || co.x > max.x || co.y < min.y || co.y > max.y || co.z < min.z || co.z > max.z) return false;
      return true;
    });

    q.push(...filtered);
  }
};

const second = () => {
  const map = makeMap();
  markOuter(map);
  let counter = 0;
  commands.forEach((c) => {
    const adjacent = getAdjacent(c).filter((c) => {
      return get(map, c) === '2';
    });
    counter += adjacent.length;
  });

  log('second', counter);
};

const main = () => {
  first();
  second();
};

export default main;
