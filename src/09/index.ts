import fs from 'fs';

const lines = fs
  .readFileSync('./src/09/input.txt')
  .toString()
  .split('\n')
  .map((line) => {
    const spl = line.split(' ');
    return { command: spl[0], times: Number(spl[1]) };
  });

lines.pop();

const moveHead = (where, headPos) => {
  if (where === 'U') {
    headPos[1]--;
  }
  if (where === 'D') {
    headPos[1]++;
  }
  if (where === 'L') {
    headPos[0]--;
  }
  if (where === 'R') {
    headPos[0]++;
  }
  return headPos;
};

const catchUp = (headPos, tailPos) => {
  const diffX = headPos[0] - tailPos[0];
  const diffY = headPos[1] - tailPos[1];

  if (Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) return tailPos;

  if (diffX === 0) {
    tailPos[1] += diffY > 0 ? 1 : -1;
    return tailPos;
  }
  if (diffY === 0) {
    tailPos[0] += diffX > 0 ? 1 : -1;
    return tailPos;
  }

  const moveX = diffX > 0 ? 1 : -1;
  const moveY = diffY > 0 ? 1 : -1;
  tailPos[0] += moveX;
  tailPos[1] += moveY;
  return tailPos;
};

const viz = (headPos, tailPos, fromX, toX, fromY, toY) => {
  console.log('\n');
  for (let yi = fromY; yi < toY; yi++) {
    const toPrint = [];

    for (let xi = 0 - fromX; xi < toX; xi++) {
      if (xi === headPos[0] && yi === headPos[1]) {
        toPrint.push('H');
        continue;
      }
      if (xi === tailPos[0] && yi === tailPos[1]) {
        toPrint.push('T');
        continue;
      }
      if (xi === 0 && yi === 5) {
        toPrint.push('s');
        continue;
      }

      toPrint.push('.');
    }

    console.log(toPrint.join(''));
  }
  console.log('\n');
};

const first = () => {
  const positions = new Set();
  let headPos = [0, 5];
  let tailPos = [0, 5];

  lines.forEach(({ command, times }) => {
    positions.add(`${tailPos[0]} ${tailPos[1]}`);
    for (let i = 0; i < times; i++) {
      headPos = moveHead(command, headPos);
      tailPos = catchUp(headPos, tailPos);
      positions.add(`${tailPos[0]} ${tailPos[1]}`);
    }
  });
  return positions.size;
};

const second = () => {
  const positions = new Set();
  let headPos = [0, 5];
  let tailPoses = [
    [0, 5],
    [0, 5],
    [0, 5],
    [0, 5],
    [0, 5],
    [0, 5],
    [0, 5],
    [0, 5],
    [0, 5],
  ];

  lines.forEach(({ command, times }) => {
    positions.add(`${tailPoses[8][0]} ${tailPoses[8][1]}`);
    for (let i = 0; i < times; i++) {
      headPos = moveHead(command, headPos);
      for (let t = 0; t < tailPoses.length; t++) {
        if (t === 0) {
          tailPoses[t] = catchUp(headPos, tailPoses[t]);
        } else {
          tailPoses[t] = catchUp(tailPoses[t - 1], tailPoses[t]);
        }
      }
      positions.add(`${tailPoses[8][0]} ${tailPoses[8][1]}`);
    }
  });
  return positions.size;
};

const main = () => {
  console.log('first', first());
  console.log('second', second());
};

export default main;
