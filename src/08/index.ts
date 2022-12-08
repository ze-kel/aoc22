import fs from 'fs';

const lines = fs.readFileSync('./src/08/input.txt').toString().split('\n');

lines.pop();

type ICoord = {
  x: number;
  y: number;
};

const getValue = (coord: ICoord) => {
  return Number(lines[coord.y][coord.x]);
};

const xLen = lines[0].length;
const yLen = lines.length;

const lookAllSides = ({ x, y }: ICoord) => {
  const myVal = getValue({ x, y });
  let vLeft = true;
  let vRight = true;
  let vTop = true;
  let vBottom = true;
  let seenRight = 0;
  let seenLeft = 0;
  let seenTop = 0;
  let seenBottom = 0;
  let seenBigger = false;
  //to right
  for (let i = x + 1; i < xLen; i++) {
    const val = getValue({ x: i, y });
    if (val >= myVal) {
      vLeft = false;
    }
    if (!seenBigger) {
      seenRight++;
      if (val >= myVal) {
        seenBigger = true;
      }
    }
  }
  //to left
  seenBigger = false;
  for (let i = x - 1; i >= 0; i--) {
    const val = getValue({ x: i, y });
    if (val >= myVal) {
      vRight = false;
    }
    if (!seenBigger) {
      seenLeft++;
      if (val >= myVal) {
        seenBigger = true;
      }
    }
  }
  //to bottom
  seenBigger = false;
  for (let i = y + 1; i < yLen; i++) {
    const val = getValue({ x, y: i });
    if (val >= myVal) {
      vBottom = false;
    }
    if (!seenBigger) {
      seenBottom++;
      if (val >= myVal) {
        seenBigger = true;
      }
    }
  }
  //to top
  seenBigger = false;
  for (let i = y - 1; i >= 0; i--) {
    const val = getValue({ x, y: i });
    if (val >= myVal) {
      vTop = false;
    }
    if (!seenBigger) {
      seenTop++;
      if (val >= myVal) {
        seenBigger = true;
      }
    }
  }

  return {
    seen: vLeft || vRight || vBottom || vTop,
    value: seenLeft * seenRight * seenTop * seenBottom,
  };
};

const getFirst = () => {
  let counter = 0;
  let maxScore = 0;
  for (let x = 0; x < xLen; x++) {
    for (let y = 0; y < yLen; y++) {
      const res = lookAllSides({ x, y });
      if (res.seen) {
        counter++;
      }
      if (res.value > maxScore) {
        maxScore = res.value;
      }
    }
  }
  return { counter, maxScore };
};

const main = () => {
  const res = getFirst();
  console.log('first', res.counter);

  console.log('second', res.maxScore);
};

export default main;
