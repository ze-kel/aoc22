import fs from "fs";
import { log, time, timeEnd } from "console";
import cloneDeep from "lodash/cloneDeep.js";

const lines = fs
  .readFileSync("./src/24/input.txt")
  .toString()
  .split("\n")
  .filter((l) => l.length);

const map = {};

const width = lines[0].length;
const height = lines.length;

lines.forEach((line, y) => {
  map[y] = {};
  line.split("").forEach((char, x) => {
    if (char !== "#") {
      map[y][x] = [];
      if (["<", ">", "^", "v"].includes(char)) {
        map[y][x].push(char);
      }
    }
  });
});

const moveAllBlizzards = (oldMap) => {
  const map = cloneDeep(oldMap);
  const afterMove = [];

  Object.keys(map).forEach((y) => {
    const line = map[y];
    Object.keys(line).forEach((x) => {
      const arr = line[x];
      if (!Array.isArray(arr)) return;

      arr.forEach((bliz) => {
        let toX = Number(x);
        let toY = Number(y);
        if (bliz === "<") {
          toX--;
          if (!map[toY][toX]) {
            toX = width - 2;
          }
        }
        if (bliz === ">") {
          toX++;
          if (!map[toY][toX]) {
            toX = 1;
          }
        }
        if (bliz === "^") {
          toY--;
          if (!map[toY][toX]) {
            toY = height - 2;
          }
        }
        if (bliz === "v") {
          toY++;
          if (!map[toY][toX]) {
            toY = 1;
          }
        }
        afterMove.push([toY, toX, bliz]);
      });

      line[x] = [];
    });
  });

  afterMove.forEach((c) => {
    map[c[0]][c[1]].push(c[2]);
  });

  return map;
};

const findMoves = (map, player) => {
  const moves = [
    [player.x + 1, player.y],
    [player.x - 1, player.y],
    [player.x, player.y + 1],
    [player.x, player.y - 1],
    [player.x, player.y],
  ];

  const filtered = moves.filter(([x, y]) => {
    if (map[y] && Array.isArray(map[y][x]) && map[y][x].length === 0)
      return true;
    return false;
  });

  return filtered.map(([x, y]) => {
    return { x, y };
  });
};

let cMap = map;

const search2 = (p, finish) => {
  let minute = 0;
  let places: any = { initial: p };

  while (minute < 1000) {
    minute++;
    cMap = moveAllBlizzards(cMap);
    const newPlaces = {};

    const vals = Object.values(places);

    for (let i = 0; i < vals.length; i++) {
      const p = vals[i];
      const afterMoves = findMoves(cMap, p);

      for (let m = 0; m < afterMoves.length; m++) {
        const mov = afterMoves[m];

        if (mov.x === finish.x && mov.y === finish.y) {
          return minute;
        }

        newPlaces[`${mov.x}-${mov.y}`] = mov;
      }
    }
    places = newPlaces;
  }
};

const start = { x: 1, y: 0 };

const finish = {
  x: width - 2,
  y: height - 1,
};

const main = () => {
  const first = search2(start, finish);
  log("first", first);
  const second = search2(finish, start);
  const third = search2(start, finish);
  log("second", first + second + third);
};

export default main;
