import fs from 'fs';

const file = fs.readFileSync('./src/03/input.txt').toString();

const lines = file.split('\n');

lines.pop();

const splitted = lines.map((line) => {
  const full = line.split('');
  const half = Math.floor(full.length / 2);

  return [full.slice(0, half), full.slice(half)];
});

const getPriority = (letter: string) => {
  if (letter === letter.toLowerCase()) {
    return letter.charCodeAt(0) - 96;
  }

  return letter.charCodeAt(0) - 65 + 27;
};

const main = () => {
  let firstCounter = 0;

  splitted.forEach((pair) => {
    const first = pair[0];
    const second = pair[1];

    for (let i = 0; i < first.length; i++) {
      if (second.includes(first[i])) {
        firstCounter += getPriority(first[i]);
        return;
      }
    }
  });

  console.log('first', firstCounter);

  let secondCounter = 0;
  let addedAlready = false;

  for (let i = 0; i < lines.length; i += 3) {
    const first = lines[i];
    const second = lines[i + 1];
    const third = lines[i + 2];
    addedAlready = false;

    for (let y = 0; y < first.length; y++) {
      if (second.includes(first[y]) && third.includes(first[y])) {
        if (!addedAlready) {
          secondCounter += getPriority(first[y]);
        }
        addedAlready = true;
      }
    }
  }

  console.log('second', secondCounter);
};

export default main;
