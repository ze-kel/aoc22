import fs from 'fs';

const file = fs.readFileSync('./src/02/input.txt').toString();

const letterMap = {
  X: 'rock',
  Y: 'paper',
  Z: 'scissors',
  A: 'rock',
  B: 'paper',
  C: 'scissors',
};

const letterMap2 = {
  X: 'lose',
  Y: 'draw',
  Z: 'win',
  A: 'rock',
  B: 'paper',
  C: 'scissors',
};

const scoreMap = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const winMap = {
  rock: 'paper',
  paper: 'scissors',
  scissors: 'rock',
};

const loseMap = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

const evalPair = (opp, you) => {
  if (opp === you) return 3 + scoreMap[you];

  if (winMap[opp] === you) return 6 + scoreMap[you];
  if (loseMap[opp] === you) return 0 + scoreMap[you];
};

const pairs = file.split('\n').map((el) => el.split(' '));

pairs.pop();

const pairsP = pairs.map((pair) => {
  return [letterMap[pair[0]], letterMap[pair[1]]];
});

const pairsP2 = pairs.map((pair) => {
  return [letterMap2[pair[0]], letterMap2[pair[1]]];
});

const main = () => {
  let counter = 0;

  pairsP.forEach((pair) => {
    counter += evalPair(pair[0], pair[1]);
  });

  console.log('first', counter);

  let counter2 = 0;

  pairsP2.forEach((pair) => {
    let match;

    if (pair[1] === 'draw') {
      match = pair[0];
    }

    if (pair[1] === 'win') {
      match = winMap[pair[0]];
    }

    if (pair[1] === 'lose') {
      match = loseMap[pair[0]];
    }

    counter2 += evalPair(pair[0], match);
  });

  console.log('second', counter2);
};

export default main;
