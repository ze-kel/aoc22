import fs from 'fs';

const file = fs.readFileSync('./src/05/input.txt').toString();

const split = file.split('\n\n');

const initial = split[0].split('\n');
initial.pop();

type IMove = {
  move: number;
  from: number;
  to: number;
};

const moves = split[1].split('\n').map((line) => {
  const arr = line.split(' ');

  return { move: Number(arr[1]), from: Number(arr[3]), to: Number(arr[5]) };
});

moves.pop();

const getInitial = () => {
  const state = [];

  for (let x = initial.length - 1; x >= 0; x--) {
    const line = initial[x];

    let realTarget = 0;

    for (let i = 1; i < line.length; i += 4) {
      if (line[i] !== ' ') {
        if (!state[realTarget]) {
          state[realTarget] = [];
        }

        state[realTarget].push(line[i]);
      }
      realTarget++;
    }
  }

  return state;
};

const processMove1 = (state, move: IMove) => {
  for (let i = 0; i < move.move; i++) {
    const el = state[move.from - 1].pop();
    state[move.to - 1].push(el);
  }
};

const processMove2 = (state, move: IMove) => {
  const toAppend = [];

  for (let i = 0; i < move.move; i++) {
    const el = state[move.from - 1].pop();
    toAppend.push(el);
  }
  
  state[move.to - 1].push(...toAppend.reverse());
};

const getFirst = () => {
  const state = getInitial();
  moves.forEach((move) => processMove1(state, move));
  return state
    .map((line) => {
      return line[line.length - 1];
    })
    .join('');
};

const getSecond = () => {
  const state = getInitial();
  moves.forEach((move) => processMove2(state, move));
  return state
    .map((line) => {
      return line[line.length - 1];
    })
    .join('');
};

const main = () => {
  console.log('first', getFirst());

  console.log('second', getSecond());
};

export default main;
