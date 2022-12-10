import fs from 'fs';

const lines = fs
  .readFileSync('./src/10/input.txt')
  .toString()
  .split('\n')
  .map((line) => {
    const spl = line.split(' ');
    return { command: spl[0], number: Number(spl[1]) };
  });

lines.pop();

let x = 1;

const twentiethVals = [];

const toDraw = [[], [], [], [], [], []];

const processLines = () => {
  let currentInstruction = 0;
  let cycle = 0;
  let wait = 0;
  let recordValAt = 20;

  while (currentInstruction < lines.length) {
    cycle++;
    const instruction = lines[currentInstruction];

    if (cycle === recordValAt) {
      twentiethVals.push(cycle * x);
      recordValAt += 40;
    }

    // Drawing
    const yD = Math.floor((cycle - 1) / 40);
    const xD = cycle - yD * 40 - 1;
    const isLit = [x - 1, x, x + 1].includes(xD);
    toDraw[yD][xD] = isLit ? '#' : '.';

    if (wait > 0) {
      wait--;

      if (wait === 0) {
        x = x + instruction.number;
        currentInstruction++;
      }
    } else {
      if (instruction.command === 'addx') {
        wait = 1;
      } else {
        currentInstruction++;
      }
    }
  }
};

processLines();

const main = () => {
  console.log(
    'first',
    twentiethVals.reduce((a, b) => a + b, 0)
  );

  console.log('second');
  toDraw.forEach((line) => console.log(line.join('')));
};

export default main;
