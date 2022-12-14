import fs from 'fs';
import { log } from 'console';
const lines = fs
  .readFileSync('./src/14/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length)
  .map((line) => {
    return line.split(' -> ').map((pair) => {
      const [x, y] = pair.split(',');
      return { x, y };
    });
  });

const markOnMap = (map, x, y, newVal) => {
  if (!map[x]) {
    map[x] = [];
  }
  map[x][y] = newVal;
};

const getMap = (map, x, y) => {
  if (!map[x]) return 'air';
  if (!map[x][y]) return 'air';
  return map[x][y];
};

const getMaxY = (map) => {
  return map.reduce((acc, line) => {
    if (acc < line.length - 1) {
      return line.length - 1;
    }
    return acc;
  }, 0);
};

const addLine = (map, line) => {
  log(line);
  let from = line[0];
  let to;

  for (let i = 1; i < line.length; i++) {
    to = line[i];

    const isY = from.x === to.x;
    const startAt = Number(isY ? from.y : from.x);
    const endAt = Number(isY ? to.y : to.x);
    const dir = startAt - endAt > 0 ? -1 : 1;

    for (let t = startAt; t !== endAt; t += dir) {
      if (isY) {
        markOnMap(map, from.x, t, 'rock');
      } else {
        markOnMap(map, t, from.y, 'rock');
      }
    }
    markOnMap(map, to.x, to.y, 'rock');

    from = line[i];
  }
};

const iterateSand = (coords, map) => {
  const [x, y] = coords;
  //try down
  if (getMap(map, x, y + 1) === 'air') {
    return [[x, y + 1], false];
  }

  //diag left
  if (getMap(map, x - 1, y + 1) === 'air') {
    return [[x - 1, y + 1], false];
  }

  //diag right
  if (getMap(map, x + 1, y + 1) === 'air') {
    return [[x + 1, y + 1], false];
  }

  return [coords, true];
};

const addSand = (map, maxY) => {
  let coords = [500, 0];
  let stale = false;
  while (!stale) {
    const res = iterateSand(coords, map);
    coords = res[0];
    stale = res[1];
    if (coords[1] > maxY) {
      return true;
    }
  }
  markOnMap(map, coords[0], coords[1], 'sand');

  return false;
};

const first = () => {
  const map = [];
  lines.forEach((line) => addLine(map, line));
  const maxY = getMaxY(map);

  let fellDown = false;
  let counter = 0;
  while (!fellDown) {
    fellDown = addSand(map, maxY);
    if (!fellDown) {
      counter++;
    }
  }
  log('first', counter);
};

const iterateSand2 = (coords, map, floor) => {
  const [x, y] = coords;
  //try down
  if (getMap(map, x, y + 1) === 'air') {
    return [[x, y + 1], y + 1 === floor];
  }

  //diag left
  if (getMap(map, x - 1, y + 1) === 'air') {
    return [[x - 1, y + 1], y + 1 === floor];
  }

  //diag right
  if (getMap(map, x + 1, y + 1) === 'air') {
    return [[x + 1, y + 1], y + 1 === floor];
  }

  return [coords, true];
};

const addSand2 = (map, floor) => {
  let coords = [500, 0];
  let stale = false;
  while (!stale) {
    const res = iterateSand2(coords, map, floor);
    coords = res[0];
    stale = res[1];
  }
  markOnMap(map, coords[0], coords[1], 'sand');
};

const second = () => {
  const map = [];
  lines.forEach((line) => addLine(map, line));
  const floor = getMaxY(map) + 1;

  let counter = 0;
  while (getMap(map, 500, 0) !== 'sand') {
    addSand2(map, floor);
    counter++;
  }
  log('second', counter);
};

const main = () => {
  first();
  second();
};

export default main;
