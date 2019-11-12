/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { getDiff, applyDiff } from '../dist/recursive-diff';

let [a, b, c, delta] = [];
// how to use optional callback function in applyDiff function
a = { a1: { a11: { a111: 'old value' } } };
b = { a1: { a11: { a111: 'updated value' } } };
const callback = (ob) => {
  if (ob instanceof Object) {
    ob.isVisited = true;
  }
};
delta = getDiff(a, b);
c = applyDiff(a, delta, callback);
console.log(c);
// 'c' value will look like:
c = {
  __isVisited: true,
  a1: {
    __isVisited: true,
    a11: {
      __isVisited: true,
      a111: 'old value',
    },
  },
};
