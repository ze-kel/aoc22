import fs from 'fs';

const lines = fs
  .readFileSync('./src/12/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length);

const maxY = lines.length - 1;
const maxX = lines[0].length - 1;

let start;
let end;

lines.forEach((line, lineIndex) => {
  line.split('').forEach((letter, letterIndex) => {
    if (letter === 'S') {
      start = [letterIndex, lineIndex];
    }
    if (letter === 'E') {
      end = [letterIndex, lineIndex];
    }
  });
});

const canMove = (ac: number[], bc: number[]) => {
  let a = lines[ac[1]][ac[0]];
  let b = lines[bc[1]][bc[0]];

  if (a === 'S') {
    a = 'a';
  }
  if (b === 'E') {
    b = 'z';
  }
  return b.charCodeAt(0) - a.charCodeAt(0) <= 1;
};

const getAdjacent = (x, y) => {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter((el) => {
    return el[0] >= 0 && el[0] <= maxX && el[1] >= 0 && el[1] <= maxY;
  });
};

const total = (maxY + 1) * (maxX + 1);

const getCurrent = (visited) => {
  return visited.reduce((acc, line) => {
    return (
      acc +
      line.reduce((acc, el) => {
        return el ? acc + 1 : acc;
      }, 0)
    );
  }, 0);
};

const process = (start, flip = false) => {
  const cheapestPath = lines.map((el) => []);

  const visited = lines.map((el) => []);

  const recordPossiblePath = (x, y, cost) => {
    if (!cheapestPath[y][x] || cheapestPath[y][x] > cost) {
      cheapestPath[y][x] = cost;
    }
  };

  const queue = [start];
  cheapestPath[start[1]][start[0]] = 0;

  let current;

  while (queue.length) {
    current = queue.shift();
    if (visited[current[1]][current[0]]) continue;
    visited[current[1]][current[0]] = true;
    const myCost = cheapestPath[current[1]][current[0]];
    let adjacent = getAdjacent(current[0], current[1]);

    if (flip) {
      adjacent = adjacent.filter((el) => canMove(el, current));
    } else {
      adjacent = adjacent.filter((el) => canMove(current, el));
    }

    adjacent.forEach((el) => {
      recordPossiblePath(el[0], el[1], myCost + 1);
      queue.push(el);
    });
    //console.log(`${getCurrent()} / ${total}`);
  }

  return cheapestPath;
};

const main = () => {
  const cheapMap = process(start);
  console.log('first', cheapMap[end[1]][end[0]]);

  const cheapMap2 = process(end, true);

  let cheapest = Infinity;

  cheapMap2.forEach((line, lineIndex) => {
    line.forEach((pos, posIndex) => {
      if (lines[lineIndex][posIndex] === 'a') {
        const price = cheapMap2[lineIndex][posIndex];
        if (price < cheapest) {
          cheapest = price;
        }
      }
    });
  });

  console.log('second', cheapest);
};

export default main;
