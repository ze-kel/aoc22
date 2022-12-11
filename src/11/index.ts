import fs from 'fs';
import lodash from 'lodash';

const getOperation = (input) => {
  const inp = input.replace('  Operation: new = ', '');
  return (old) => {
    return eval(inp);
  };
};

const monkeParser = (str: string) => {
  const lines = str.split('\n');

  const items = lines[1]
    .replace('Starting items: ', '')
    .split(', ')
    .map((el) => Number(el));

  const operation = getOperation(lines[2]);

  const testDivisbleBy = Number(lines[3].replace('  Test: divisible by ', ''));

  const targetTrue = Number(lines[4].replace('    If true: throw to monkey ', ''));
  const targetFalse = Number(lines[5].replace('    If false: throw to monkey ', ''));

  return { items, operation, testDivisbleBy, targetFalse, targetTrue, lookedAtItems: 0 };
};

const processMonkes = (monkeArray, iterations, divided) => {
  monkeArray = lodash.cloneDeep(monkeArray);
  for (let i = 0; i < iterations; i++) {
    monkeArray.forEach((monke) => {
      monke.items.forEach((item) => {
        monke.lookedAtItems++;
        item = monke.operation(item);
        if (divided) {
          item = Math.floor(item / 3);
        }
        const checkResult = item % monke.testDivisbleBy === 0;

        if (checkResult) {
          monkeArray[monke.targetTrue].items.push(item);
        } else {
          monkeArray[monke.targetFalse].items.push(item);
        }
      });

      monke.items = [];
    });
  }
  return monkeArray;
};

const first = () => {
  const allMonkes = fs.readFileSync('./src/11/input.txt').toString().split('\n\n').map(monkeParser);

  const results = processMonkes(allMonkes, 20, true);
  const scores = results.map((el) => el.lookedAtItems);
  scores.sort((a, b) => b - a);
  //console.log(scores);
  return scores[0] * scores[1];
};

const getOperation2 = (line: string) => {
  const tokens = line.replace('  Operation: new = old ', '').split(' ');
  const isMultiply = tokens[0] === '*';
  const isByItself = tokens[1] === 'old';
  return ({ raw, statuses }) => {
    Object.keys(statuses).forEach((key) => {
      let newNum;
      if (isMultiply) {
        newNum = statuses[key] * (isByItself ? statuses[key] : Number(tokens[1]));
      } else {
        newNum = statuses[key] + Number(tokens[1]);
      }
      if (newNum >= Number(key)) {
        newNum -= Number(key) * Math.floor(newNum / Number(key));
      }
      statuses[key] = newNum;
    });
    return { raw, statuses };
  };
};

const monkeParser2 = (str: string, divideBy: number[]) => {
  const lines = str.split('\n');

  const testDivisbleBy = Number(lines[3].replace('  Test: divisible by ', ''));

  const items = lines[1]
    .replace('Starting items: ', '')
    .split(', ')
    .map((el) => {
      const statuses = {};
      divideBy.forEach((toDivide) => {
        statuses[toDivide] = Number(el) % toDivide;
      });
      return { raw: BigInt(el), statuses };
    });

  const operation = getOperation2(lines[2]);

  const targetTrue = Number(lines[4].replace('    If true: throw to monkey ', ''));
  const targetFalse = Number(lines[5].replace('    If false: throw to monkey ', ''));

  return { items, operation, targetFalse, targetTrue, lookedAtItems: 0, testDivisbleBy };
};

const processMonkes2 = (monkeArray, iterations) => {
  monkeArray = lodash.cloneDeep(monkeArray);
  for (let i = 0; i < iterations; i++) {
    monkeArray.forEach((monke) => {
      monke.items.forEach((item) => {
        monke.lookedAtItems++;
        item = monke.operation(item);

        if (item.statuses[monke.testDivisbleBy] === 0) {
          monkeArray[monke.targetTrue].items.push(item);
        } else {
          monkeArray[monke.targetFalse].items.push(item);
        }
      });

      monke.items = [];
    });
  }
  return monkeArray;
};

const second = () => {
  const allMonkes = fs.readFileSync('./src/11/input.txt').toString().split('\n\n');

  const divideBy = allMonkes.map((el) => {
    const lines = el.split('\n');
    return Number(lines[3].replace('  Test: divisible by ', ''));
  });

  const mapped = allMonkes.map((el) => monkeParser2(el, divideBy));

  const results = processMonkes2(mapped, 10000);
  const scores = results.map((el) => el.lookedAtItems);
  //console.log(scores);
  scores.sort((a, b) => b - a);
  return scores[0] * scores[1];
};

const main = () => {
  console.log('first', first());
  console.log('second', second());
};

export default main;
