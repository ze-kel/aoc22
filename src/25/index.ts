import fs from "fs";
import { log, time, timeEnd } from "console";
import cloneDeep from "lodash/cloneDeep.js";
import sum from "lodash/sum.js";

const lines = fs
  .readFileSync("./src/25/input.txt")
  .toString()
  .split("\n")
  .filter((l) => l.length);

const conv = {
  "=": -2,
  "-": -1,
  "0": 0,
  1: 1,
  2: 2,
};

const order = ["1", "0", "-", "="];

const toRegular = (num: string) => {
  const n = num.split("");

  let result = 0;
  let base = 1;
  for (let i = n.length - 1; i >= 0; i--) {
    result += conv[n[i]] * base;
    base = base * 5;
  }
  return result;
};

const findClosest = (number) => {
  let reg;
  for (let i = 1; i < 50; i++) {
    const n = Array.from(Array(i)).map((_) => "2");

    if (toRegular(n.join("")) > number) {
      reg = n;
      break;
    }
  }

  for (let i = 0; i < reg.length; i++) {
    for (let o = 0; o < order.length; o++) {
      const nReg = [...reg];
      nReg[i] = order[o];

      if (toRegular(nReg.join("")) >= number) {
        reg = nReg;
      }
    }
  }

  return reg.join("");
};

const main = () => {
  const inReg = lines.map(toRegular);

  const sumeed = sum(inReg);
  log(sumeed);
  const res = findClosest(sumeed);
  log(res);
};

export default main;
