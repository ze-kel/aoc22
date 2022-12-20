import fs from 'fs';
import { log, time, timeEnd } from 'console';

const reg = new RegExp(
  /(\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+)/,
  'i'
);

const commands = fs
  .readFileSync('./src/19/input.txt')
  .toString()
  .split('\n')
  .filter((el) => el.length)
  .map((el) => {
    const text = reg.exec(el);
    const m = text.map((el) => Number(el));
    const res = {
      index: m[1],
      oreRC: m[2],
      clayRC: m[3],
      obsRCOre: m[4],
      obsRCClay: m[5],
      geodeRCOre: m[6],
      geodeRCObs: m[7],
      maxOreSpend: Math.max(m[2], m[3], m[4], m[6]),
      maxClaySpend: m[5],
      maxObsSpend: m[7],
    };
    return res;
  });

type Rules = typeof commands[0];

type State = {
  robotsOre: number;
  robotsCla: number;
  robotsObs: number;
  robotsGeo: number;
  ore: number;
  clay: number;
  obs: number;
  geo: number;
};

const getOptions = (state: State, rules: Rules, steps: number) => {
  const opt = [{ ...state }];

  if (steps === 1) return opt;

  // buy geo
  const canBuyGeo = state.ore >= rules.geodeRCOre && state.obs >= rules.geodeRCObs;

  if (canBuyGeo) {
    return [
      {
        ...state,
        robotsGeo: state.robotsGeo + 1,
        ore: state.ore - rules.geodeRCOre,
        obs: state.obs - rules.geodeRCObs,
      },
    ];
  }

  if (steps === 2) return opt;

  // buy obs
  const canBuyObs = state.ore >= rules.obsRCOre && state.clay >= rules.obsRCClay;
  if (canBuyObs) {
    opt.push({
      ...state,
      robotsObs: state.robotsObs + 1,
      ore: state.ore - rules.obsRCOre,
      clay: state.clay - rules.obsRCClay,
    });
    return opt;
  }

  // buy clay
  const canBuyClay = state.ore >= rules.clayRC;
  if (canBuyClay) {
    opt.push({ ...state, robotsCla: state.robotsCla + 1, ore: state.ore - rules.clayRC });
    //return opt;
  }

  const canBuyOre = state.ore >= rules.oreRC;
  // buy ore
  if (canBuyOre) {
    opt.push({ ...state, robotsOre: state.robotsOre + 1, ore: state.ore - rules.oreRC });
  }

  return opt;
};

const yeild = (stateToUpd: State, stateIntial: State): State => {
  const upd = { ...stateToUpd };

  upd.ore += stateIntial.robotsOre;
  upd.obs += stateIntial.robotsObs;
  upd.clay += stateIntial.robotsCla;
  upd.geo += stateIntial.robotsGeo;
  return upd;
};

type Cache = Record<string, Record<string, State>>;

const getHash = (state: State) => {
  return `${state.clay} ${state.geo} ${state.obs} ${state.ore} ${state.robotsCla} ${state.robotsGeo} ${state.robotsObs} ${state.robotsOre}`;
};

const useCache = true;
const useMinCache = true;

const maximize = (state: State, rules: Rules, steps: number, cache: Cache) => {
  if (steps === 0) return state;
  if (steps === 1) return yeild(state, state);

  const myHash = getHash(state);
  if (useCache) {
    if (cache[myHash]) {
      if (cache[myHash][steps]) {
        return cache[myHash][steps];
      }
      if (useMinCache) {
        const canBeReachedBy = Object.keys(cache[myHash]).map((v) => Number(v));
        const max = Math.max(...canBeReachedBy);
        if (max > steps) {
          return cache[myHash][max];
        }
      }
    }
  }

  const options = getOptions(state, rules, steps).map((st) => {
    return yeild(st, state);
  });

  const res: State[] = options.map((opt) => {
    return maximize(opt, rules, steps - 1, cache);
  });

  const max = res.reduce((max, st) => {
    if (max.geo > st.geo) {
      return max;
    }

    if (max.geo == st.geo) {
      if (max.robotsGeo > st.robotsGeo) {
        return max;
      }
    }

    return st;
  });

  if (!cache[myHash]) {
    cache[myHash] = {};
  }
  cache[myHash][steps] = max;

  return max;
};
const initial: State = {
  robotsOre: 1,
  robotsCla: 0,
  robotsObs: 0,
  robotsGeo: 0,
  ore: 0,
  clay: 0,
  obs: 0,
  geo: 0,
};

const first = () => {
  let counter = 0;
  const minutes = 24;

  log('minutes', minutes);

  const getValue = (comm) => {
    time('command' + comm.index);
    const max = maximize({ ...initial }, comm, minutes, {});
    log(`commmand ${comm.index}`, max);
    log('max', max.geo);
    counter += max.geo * comm.index;
    timeEnd('command' + comm.index);
    log('\n');
  };
  commands.forEach((c) => getValue(c));

  log('first', counter);
};

const getOptions2 = (state: State, rules: Rules, steps: number) => {
  if (steps === 1) return [{ ...state }];
  const opt = [];

  // buy geo
  const canBuyGeo = state.ore >= rules.geodeRCOre && state.obs >= rules.geodeRCObs;
  if (canBuyGeo) {
    return [
      {
        ...state,
        robotsGeo: state.robotsGeo + 1,
        ore: state.ore - rules.geodeRCOre,
        obs: state.obs - rules.geodeRCObs,
      },
    ];
  }

  if (steps === 2) return [{ ...state }];

  // buy obs
  const canBuyObs = state.ore >= rules.obsRCOre && state.clay >= rules.obsRCClay;
  const shouldBuyObs = rules.maxObsSpend > state.robotsObs;
  if (canBuyObs && shouldBuyObs) {
    opt.push({
      ...state,
      robotsObs: state.robotsObs + 1,
      ore: state.ore - rules.obsRCOre,
      clay: state.clay - rules.obsRCClay,
    });
    //return opt;
  }

  // buy clay
  const canBuyClay = state.ore >= rules.clayRC;
  const shouldBuyClay = rules.maxClaySpend > state.robotsCla;
  if (canBuyClay && shouldBuyClay) {
    opt.push({ ...state, robotsCla: state.robotsCla + 1, ore: state.ore - rules.clayRC });
    //return opt;
  }

  const canBuyOre = state.ore >= rules.oreRC;
  const shouldBuyOre = rules.maxOreSpend > state.robotsOre;
  // buy ore
  if (canBuyOre && shouldBuyOre) {
    opt.push({ ...state, robotsOre: state.robotsOre + 1, ore: state.ore - rules.oreRC });
  }

  //if (!canBuyClay || !canBuyGeo || !canBuyObs || !canBuyOre) { }
  opt.push({ ...state });

  return opt;
};

const maxGeo = [];

const maximize2 = (state: State, rules: Rules, steps: number, cache: Cache) => {
  if (steps === 0) return state;
  if (steps === 1) return yeild(state, state);

  const myHash = getHash(state);
  if (useCache) {
    if (cache[myHash]) {
      if (cache[myHash][steps]) {
        return cache[myHash][steps];
      }
      if (useMinCache) {
        const canBeReachedBy = Object.keys(cache[myHash]).map((v) => Number(v));
        const max = Math.max(...canBeReachedBy);
        if (max > steps) {
          return cache[myHash][max];
        }
      }
    }
  }

  const options = getOptions2(state, rules, steps).map((st) => {
    return yeild(st, state);
  });

  options.forEach((s) => {
    if (!maxGeo[steps] || maxGeo[steps] < s.geo) {
      maxGeo[steps] = s.geo;
    }
  });

  const filtered = options.filter((s) => {
    if (!maxGeo[steps]) return true;
    return s.geo > maxGeo[steps] - 2;
  });

  const res: State[] = filtered.map((opt) => {
    return maximize2(opt, rules, steps - 1, cache);
  });

  if (!res.length) return state;

  const max = res.reduce((max, st) => {
    if (max.geo > st.geo) {
      return max;
    }

    if (max.geo == st.geo) {
      if (max.robotsGeo > st.robotsGeo) {
        return max;
      }
    }

    return st;
  });

  if (!cache[myHash]) {
    cache[myHash] = {};
  }
  cache[myHash][steps] = max;

  return max;
};

const second = () => {
  const minutes = 32;

  log('minutes', minutes);
  time('s2');
  const max1 = maximize2({ ...initial }, commands[0], minutes, {});
  const max2 = maximize2({ ...initial }, commands[1], minutes, {});
  const max3 = maximize2({ ...initial }, commands[2], minutes, {});
  timeEnd('s2');

  log('second', max1.geo * max2.geo * max3.geo);
};

const main = () => {
  //first();
  second();
};

//1395 too low

export default main;
