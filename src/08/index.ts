import fs from 'fs';

const lines = fs.readFileSync('./src/08/input.txt').toString().split('\n');

lines.pop();

const getFirst = () => {};

const getSecond = () => {};

const main = () => {
  console.log('first', getFirst());

  console.log('second', getSecond());
};

export default main;
