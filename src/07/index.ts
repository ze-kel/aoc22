import fs from 'fs';

const lines = fs.readFileSync('./src/07/input.txt').toString().split('\n');

type IFile = {
  type: 'file';
  parent: IDir;
  name: string;
  size: number;
};

type IDir = {
  type: 'dir';
  parent?: IDir;
  name: string;
  content: Array<IFile | IDir>;
  size?: number;
};

const root: IDir = {
  type: 'dir',
  name: '/',
  content: [],
};

const allDirs = [root];

let target = root;

lines.forEach((line) => {
  if (line === '$ cd /') return;

  if (line.startsWith('$ ls')) return;

  if (line.startsWith('$ cd')) {
    const token = line.split(' ')[2];

    if (token === '..') {
      target = target.parent;
      return;
    }

    const moveTo = target.content.find((el) => {
      // @ts-ignore
      if (!el.content) return false;
      if (el.name === token) {
        return true;
      }
    });

    if (moveTo) {
      target = moveTo as IDir;
    } else {
      const newDir: IDir = {
        type: 'dir',
        parent: target,
        name: token,
        content: [],
      };

      target.content.push(newDir);
      allDirs.push(newDir);
      target = newDir;
    }
    return;
  }

  const splitted = line.split(' ');
  if (splitted[0] === 'dir') return;

  const alreadyThere = target.content.find((el) => {
    return el.name === splitted[1];
  });

  if (!alreadyThere) {
    const outFile: IFile = {
      type: 'file',
      parent: target,
      name: splitted[1],
      size: Number(splitted[0]),
    };
    target.content.push(outFile);
  }
});

const getSize = (target: IDir | IFile) => {
  if (target.type === 'file') {
    return target.size;
  }

  let counter = 0;

  target.content.forEach((el) => {
    const subSize = getSize(el);
    counter += subSize;
  });

  target.size = counter;

  return counter;
};

getSize(root);

const getFirst = () => {
  const filt = allDirs.filter((dir) => dir.size < 100000);
  return filt.reduce((acc, folder) => {
    return acc + folder.size;
  }, 0);
};

const getSecond = () => {
  const free = 70000000 - root.size;
  const atLeast = 30000000 - free;

  let smallest = root;

  allDirs.forEach((fldr) => {
    if (fldr.size >= atLeast && fldr.size < smallest.size) {
      smallest = fldr;
    }
  });

  return smallest.size;
};

const main = () => {
  console.log('first', getFirst());

  console.log('second', getSecond());
};

export default main;
