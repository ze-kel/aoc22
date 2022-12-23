import fs from "fs";
import { log, time, timeEnd } from "console";
import cloneDeep from "lodash/cloneDeep.js";

const lines = fs.readFileSync("./src/23/input.txt").toString().split("\n");

const map: Mapa = {};

type Mapa = Record<string, Record<string, any>>;

lines.forEach((line, li) => {
  const l = {};

  line.split("").forEach((p, pi) => {
    if (p === "#") {
      l[pi] = p;
    }
  });

  map[li] = l;
});

const setMap = (map, x, y, val) => {
  if (!map[y]) {
    map[y] = {};
  }
  if (val === undefined) {
    delete map[y][x];
  } else {
    map[y][x] = val;
  }
};

const getMap = (map, x, y) => {
  if (!map[y]) return;
  return map[y][x];
};

const move = (map, x1, y1, x2, y2) => {
  const el = getMap(map, x1, y1);

  if (!el) {
    log(`${x1} ${y1} ${el}`);
    throw new Error("cant move undef");
  }

  setMap(map, x1, y1, undefined);
  setMap(map, x2, y2, el);
};

const findProposedMove = (map, x: number, y: number, order) => {
  const n = getMap(map, x, y - 1);
  const nw = getMap(map, x - 1, y - 1);
  const ne = getMap(map, x + 1, y - 1);
  const s = getMap(map, x, y + 1);
  const sw = getMap(map, x - 1, y + 1);
  const se = getMap(map, x + 1, y + 1);
  const e = getMap(map, x + 1, y);
  const w = getMap(map, x - 1, y);

  if (!n && !nw && !ne && !s && !sw && !se && !e && !w) {
    return null;
  }

  for (let i = 0; i < order.length; i++) {
    const dir = order[i];

    if (dir === "n") {
      if (!n && !ne && !nw) {
        return [x, y, x, y - 1];
      }
    }

    if (dir === "s") {
      if (!s && !se && !sw) {
        return [x, y, x, y + 1];
      }
    }

    if (dir === "w") {
      if (!w && !nw && !sw) {
        return [x, y, x - 1, y];
      }
    }

    if (dir === "e") {
      if (!e && !ne && !se) {
        return [x, y, x + 1, y];
      }
    }
  }

  return null;
};

const round = (map: Mapa, order) => {
  const proposedMoves: Record<string, any[]> = {};
  Object.keys(map).forEach((yS) => {
    const y = Number(yS);
    const line = map[y];

    Object.keys(line).forEach((xS) => {
      const x = Number(xS);
      const element = getMap(map, x, y);
      if (!element) return;
      const proposedMove = findProposedMove(map, x, y, order);
      if (proposedMove !== null) {
        const key = `${proposedMove[2]}-${proposedMove[3]}`;
        if (proposedMoves[key]) {
          proposedMoves[key] = null;
        } else {
          proposedMoves[key] = proposedMove;
        }
      }
    });
  });

  Object.values(proposedMoves).forEach((m) => {
    if (m === null) return;
    move(map, m[0], m[1], m[2], m[3]);
  });

  return Object.keys(proposedMoves).length;
};

const viz = (map, xFrom, xTo, yFrom, yTo) => {
  for (let y = yFrom; y <= yTo; y++) {
    const line = [];

    for (let x = xFrom; x <= xTo; x++) {
      const el = getMap(map, x, y);
      if (!el) {
        line.push(".");
      } else {
        line.push(el);
      }
    }

    log(line.join(""));
  }
};

const getEmpty = (map, xFrom, xTo, yFrom, yTo) => {
  let counter = 0;
  for (let y = yFrom; y <= yTo; y++) {
    for (let x = xFrom; x <= xTo; x++) {
      const el = getMap(map, x, y);
      if (!el) {
        counter++;
      }
    }
  }
  return counter;
};

const getMinMax = (map) => {
  const [yMin, yMax] = Object.keys(map).reduce(
    (acc, key) => {
      const isValid = Object.values(map[key]).some((v) => v);

      if (!isValid) return acc;

      if (Number(key) < acc[0]) {
        acc[0] = Number(key);
      }
      if (Number(key) > acc[1]) {
        acc[1] = Number(key);
      }

      return acc;
    },
    [Infinity, -Infinity]
  );

  //@ts-ignore
  const [xMin, xMax] = Object.values(map).reduce(
    (acc, line) => {
      Object.keys(line).forEach((key) => {
        if (Number(key) < acc[0]) {
          acc[0] = Number(key);
        }
        if (Number(key) > acc[1]) {
          acc[1] = Number(key);
        }
      });
      return acc;
    },
    [Infinity, -Infinity]
  );

  return [xMin, xMax, yMin, yMax];
};

const first = () => {
  const order = ["n", "s", "w", "e"];
  const map1 = cloneDeep(map);

  for (let i = 0; i < 10; i++) {
    round(map1, order);
    const el = order.shift();
    order.push(el);
  }
  const [xMin, xMax, yMin, yMax] = getMinMax(map1);
  const res = getEmpty(map1, xMin, xMax, yMin, yMax);
  log("first", res);
};

const second = () => {
  const order = ["n", "s", "w", "e"];

  const map2 = cloneDeep(map);

  let doRound = true;
  let curRound = 1;

  while (doRound) {
    const moves = round(map2, order);
    const el = order.shift();
    order.push(el);

    if (moves === 0) {
      doRound = false;

      log("second", curRound);
    }

    curRound++;
  }
};

const main = () => {
  first();
  second();
};

export default main;
