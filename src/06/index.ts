import fs from 'fs';

const received = fs.readFileSync('./src/06/input.txt').toString().split('\n')[0];

const getMarker = (line: string) => {
  for (let i = 0; i < line.length; i++) {
    const s = new Set([line[i], line[i + 1], line[i + 2], line[i + 3]]);
    if (s.size === 4) {
      return i + 4;
    }
  }
};

const getMessage = (line: string) => {
  for (let i = 0; i < line.length; i++) {
    const s = new Set();
    for (let y = 0; y < 14; y++) {
      s.add(line[i + y]);
    }

    if (s.size === 14) {
      return i + 14;
    }
  }
};

const getFirst = () => {
  return getMarker(received);
};

const getSecond = () => {
  return getMessage(received);
};

const main = () => {
  console.log('first', getFirst());

  console.log('second', getSecond());
};

export default main;
