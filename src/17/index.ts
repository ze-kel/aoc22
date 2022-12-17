import fs from 'fs';
import { log, time, timeEnd } from 'console';

const commands = fs
  .readFileSync('./src/17/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length)[0]
  .split('');

const setMap = (map, x, y, val) => {
  if (!map[y]) {
    map[y] = {};
  }
  map[y][x] = val;
};

const getMap = (map, x, y) => {
  if (!map[y]) return null;
  return map[y][x];
};

const addFigure = (map, index: number) => {
  let bottomPoint: number;
  const keys = Object.keys(map).map((el) => Number(el));
  if (keys.length) {
    bottomPoint = Math.max(...Object.keys(map).map((el) => Number(el))) + 4;
  } else {
    bottomPoint = 3;
  }

  const leftPoint = 2;

  switch (index) {
    case 0: {
      return [
        { x: leftPoint, y: bottomPoint },
        { x: leftPoint + 1, y: bottomPoint },
        { x: leftPoint + 2, y: bottomPoint },
        { x: leftPoint + 3, y: bottomPoint },
      ];
    }
    case 1: {
      return [
        { x: leftPoint + 1, y: bottomPoint },
        { x: leftPoint + 1, y: bottomPoint + 1 },
        { x: leftPoint, y: bottomPoint + 1 },
        { x: leftPoint + 2, y: bottomPoint + 1 },
        { x: leftPoint + 1, y: bottomPoint + 2 },
      ];
    }
    case 2: {
      return [
        { x: leftPoint, y: bottomPoint },
        { x: leftPoint + 1, y: bottomPoint },
        { x: leftPoint + 2, y: bottomPoint },
        { x: leftPoint + 2, y: bottomPoint + 1 },
        { x: leftPoint + 2, y: bottomPoint + 2 },
      ];
    }
    case 3: {
      return [
        { x: leftPoint, y: bottomPoint },
        { x: leftPoint, y: bottomPoint + 1 },
        { x: leftPoint, y: bottomPoint + 2 },
        { x: leftPoint, y: bottomPoint + 3 },
      ];
    }
    case 4: {
      return [
        { x: leftPoint, y: bottomPoint },
        { x: leftPoint + 1, y: bottomPoint },
        { x: leftPoint, y: bottomPoint + 1 },
        { x: leftPoint + 1, y: bottomPoint + 1 },
      ];
    }
  }
};

type Figure = { x: number; y: number }[];

const move = (map, figure: Figure, dir: string) => {
  let figure2: Figure;

  if (dir === '>') {
    figure2 = figure.map((p) => {
      return { x: p.x + 1, y: p.y };
    });
  } else {
    figure2 = figure.map((p) => {
      return { x: p.x - 1, y: p.y };
    });
  }

  const notAllowed = figure2.some((p) => {
    return p.x < 0 || p.x > 6 || getMap(map, p.x, p.y);
  });

  if (notAllowed) return figure;
  return figure2;
};

const gravity = (figure) => {
  return figure.map((p) => {
    return { x: p.x, y: p.y - 1 };
  });
};

const isStale = (map, figure) => {
  let stale = false;
  figure.forEach((p) => {
    const p2 = { x: p.x, y: p.y - 1 };
    if (getMap(map, p2.x, p2.y) || p2.y < 0) {
      stale = true;
    }
  });
  return stale;
};

const simulate = (rocks, moves) => {
  const map = {};
  let current;
  let figureIndex = 0;

  let stale = 0;
  let curMove = 0;

  while (stale < rocks) {
    if (!current) {
      current = addFigure(map, figureIndex);
      figureIndex++;
      if (figureIndex > 4) {
        figureIndex = 0;
      }
    }
    current = move(map, current, moves[curMove]);
    curMove++;
    if (curMove >= moves.length) {
      curMove = 0;
    }

    if (isStale(map, current)) {
      current.forEach((p) => {
        setMap(map, p.x, p.y, true);
      });
      current = null;
      stale++;
    } else {
      current = gravity(current);
    }
  }

  return map;
};

const viz = (map) => {
  const bottomPoint = Math.max(...Object.keys(map).map((el) => Number(el)));

  const lines = [];

  for (let y = 0; y <= bottomPoint; y++) {
    const line = [];
    for (let x = 0; x <= 6; x++) {
      line.push(getMap(map, x, y) ? '#' : '.');
    }

    lines.push(line.join(''));
  }

  lines.reverse();
  lines.forEach((line) => {
    log(line);
  });
};

const first = () => {
  const map = simulate(2022, commands);
  //viz(map);

  // +1 because I start coords with zero
  const topPoint = Math.max(...Object.keys(map).map((el) => Number(el))) + 1;
  log('first', topPoint);
};

const getTop = (map) => {
  return Math.max(...Object.keys(map).map((el) => Number(el)));
};

const getTopLines = (map) => {
  const topPoint = getTop(map);
  const line = [];
  for (let y = 0; y > -10; y--) {
    for (let x = 0; x <= 6; x++) {
      line.push(getMap(map, x, topPoint + y) ? '#' : '.');
    }
  }
  return line.join('');
};

const simulate2 = (rocks, moves) => {
  const map = {};
  const hashes = {};

  let current;
  let figureIndex = 0;

  let stale = 0;
  let curMove = 0;

  while (stale < rocks) {
    if (!current) {
      const hashed = hashes[`${figureIndex}-${curMove}`];
      if (hashed && hashed.line === getTopLines(map)) {
        return { loopAt: stale, before: hashed.point };
      }

      current = addFigure(map, figureIndex);
      hashes[`${figureIndex}-${curMove}`] = { line: getTopLines(map), point: stale };
      figureIndex++;
      if (figureIndex > 4) {
        figureIndex = 0;
      }
    }
    current = move(map, current, moves[curMove]);
    curMove++;
    if (curMove >= moves.length) {
      curMove = 0;
    }

    if (isStale(map, current)) {
      current.forEach((p) => {
        setMap(map, p.x, p.y, true);
      });
      current = null;
      stale++;
    } else {
      current = gravity(current);
    }
  }

  return null;
};

const simulateWithLoops = (before, loop, beforeHeight, loopHeight, staled) => {
  if (staled < before + loop) {
    return getTop(simulate(staled, commands));
  }

  const loopThrough = staled - before;
  const totalLoops = Math.floor(loopThrough / loop);
  const remainder = loopThrough - totalLoops * loop;

  let result = beforeHeight + totalLoops * loopHeight;
  if (remainder > 0) {
    result += getTop(simulate(before + remainder, commands)) - beforeHeight;
  }
  return result;
};

const second = () => {
  const { before, loopAt } = simulate2(10000, commands);
  const loop = loopAt - before;
  const beforeHeight = getTop(simulate(before, commands));
  const loopHeight = getTop(simulate(before + loop, commands)) - beforeHeight;
  const top = simulateWithLoops(before, loop, beforeHeight, loopHeight, 1000000000000);

  log('second', top + 1);
};

const main = () => {
  first();
  second();
};

export default main;
