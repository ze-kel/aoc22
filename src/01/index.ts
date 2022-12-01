import fs from 'fs';

const file = fs.readFileSync('./src/01/input.txt').toString();

const elves = file
  .split('\n\n')
  .map((el) => el.split('\n'))
  .map((el) =>
    el.reduce((a, b) => {
      return Number(a || 0) + Number(b || 0);
    }, 0)
  );

elves.sort((a, b) => {
  return b - a;
});

const main = () => {
  console.log('first');
  console.log(elves[0]);

  console.log('second');
  console.log(elves[0] + elves[1] + elves[2]);
};

export default main;
