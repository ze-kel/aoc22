import fs, { stat } from 'fs';
import { log, time, timeEnd } from 'console';

const lines = fs
  .readFileSync('./src/16/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length);

const reachable = {};
const flowRate = {};

const reg = new RegExp(/Valve (..) has flow rate=(\d+); tunnel.? lead.? to valve.? (.*)/);

lines.forEach((line) => {
  const r = reg.exec(line);
  const me = r[1];
  const flow = Number(r[2]);
  const leadTo = r[3].split(', ');
  flowRate[me] = flow;
  reachable[me] = leadTo;
});

type State = {
  me: string;
  opened: Record<string, boolean>;
  timeSpent: number;
  flow: number;
};

let cache = {};

const distances = {};

Object.keys(flowRate).forEach((p) => {
  const paths = {};
  paths[p] = 0;
  const visited = {};
  const q = [p];

  while (q.length) {
    const current = q.shift();

    reachable[current].forEach((point) => {
      const costToReach = paths[current] + 1;
      if (typeof paths[point] !== 'number' || paths[point] > costToReach) {
        paths[point] = costToReach;
      }
      if (!visited[point]) {
        q.push(point);
      }
    });
    visited[current] = true;
  }

  distances[p] = paths;
});

const findBestMove = (state: State, minsToRun, depth): State[] => {
  const canStillOpen = Object.keys(flowRate).filter((t) => !state.opened[t]);

  const possibilities = canStillOpen
    .map((valve) => {
      const minsToOpened = distances[state.me][valve] + 1;
      const potential = (minsToRun - state.timeSpent - minsToOpened) * flowRate[valve];

      return { valve, minsToOpened, potential };
    })
    .filter((p) => {
      return p.minsToOpened + state.timeSpent < minsToRun && p.potential > 0;
    });

  if (!possibilities.length) return [{ ...state, timeSpent: minsToRun }];

  possibilities.sort((a, b) => b.potential - a.potential);

  const top = possibilities.slice(0, depth);

  return top.map((best) => {
    const opened = { ...state.opened };
    opened[best.valve] = true;

    return {
      me: best.valve,
      timeSpent: state.timeSpent + best.minsToOpened,
      flow: state.flow + best.potential,
      opened,
    };
  });
};

const search = (state: State, minsToRun: number, depth) => {
  if (state.timeSpent >= minsToRun) return state;
  const possibilities = findBestMove(state, minsToRun, depth);

  let best;

  possibilities.forEach((p) => {
    const bestFromThat = search(p, minsToRun, depth);

    if (!best || bestFromThat.flow > best.flow) {
      best = bestFromThat;
    }
  });

  return best;
};

const first = () => {
  const initial: State = { me: 'AA', flow: 0, opened: {}, timeSpent: 0 };
  const res = search(initial, 30, 15);
  log(res.flow);
};

type State2 = {
  me: string;
  el: string;
  opened: Record<string, boolean>;
  timeSpentMe: number;
  timeSpentEl: number;
  flow: number;
};

const findBestMove2 = (state: State2, elephant: boolean, minsToRun, depth): State2[] => {
  const canStillOpen = Object.keys(flowRate).filter((t) => !state.opened[t]);

  const position = elephant ? state.el : state.me;
  const timeSpent = elephant ? state.timeSpentEl : state.timeSpentMe;

  const possibilities = canStillOpen
    .map((valve) => {
      const minsToOpened = distances[position][valve] + 1;
      const potential = (minsToRun - timeSpent - minsToOpened) * flowRate[valve];

      return { valve, minsToOpened, potential };
    })
    .filter((p) => {
      return p.minsToOpened + timeSpent < minsToRun && p.potential > 0;
    });

  if (!possibilities.length) {
    if (elephant) {
      return [{ ...state, timeSpentEl: minsToRun }];
    } else {
      return [{ ...state, timeSpentMe: minsToRun }];
    }
  }

  possibilities.sort((a, b) => b.potential - a.potential);

  const top = possibilities.slice(0, depth);

  return top.map((best) => {
    const opened = { ...state.opened };
    opened[best.valve] = true;

    const a = {
      ...state,
      flow: state.flow + best.potential,
      opened,
    };

    if (elephant) {
      a.el = best.valve;
      a.timeSpentEl = state.timeSpentEl + best.minsToOpened;
    } else {
      a.me = best.valve;
      a.timeSpentMe = state.timeSpentMe + best.minsToOpened;
    }

    return a;
  });
};

const hashStore = {};

const hash = (state: State2) => {
  const { me, el, timeSpentMe, timeSpentEl, opened } = state;
  const meFirst = state.me > state.el;
  const posTime = meFirst ? `${me}${timeSpentMe}${el}${timeSpentEl}` : `${el}${timeSpentEl}${me}${timeSpentMe}`;
  const openedString = Object.keys(opened).sort((a, b) => a.localeCompare(b));

  return `${posTime}-${openedString}`;
};

const search2 = (state: State2, minsToRun: number, depth) => {
  if (state.timeSpentEl >= minsToRun && state.timeSpentMe >= minsToRun) return state;

  const stateHash = hash(state);
  if (hashStore[stateHash]) {
    return hashStore[stateHash];
  }

  const elephant = state.timeSpentMe > state.timeSpentEl;

  const possibilities = findBestMove2(state, elephant, minsToRun, depth);

  let best;

  possibilities.forEach((p) => {
    const bestFromThat = search2(p, minsToRun, depth);

    if (!best || bestFromThat.flow > best.flow) {
      best = bestFromThat;
    }
  });

  hashStore[stateHash] = best;

  return best;
};

const second = () => {
  const initial: State2 = { me: 'AA', el: 'AA', flow: 0, opened: {}, timeSpentMe: 0, timeSpentEl: 0 };
  const res = search2(initial, 26, 10);
  log(res.flow);
};

const main = () => {
  time('first');
  first();
  timeEnd('first');
  time('second');
  second();
  timeEnd('second');
};

export default main;
