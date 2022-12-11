import main from './11/index.js';

main();

if (false) {
  for (let i = 0; i < 1000000; i++) {
    const before = i % 23 === 0;
    const after = (i * i) % 23 === 0;
    if (before !== after) {
      console.log('num', i);
      console.log('before', before);
      console.log('after', after);
    } else {
      console.log({ i, before, after });
    }
  }
}
