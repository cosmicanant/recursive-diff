/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { getDiff, applyDiff } from '../dist/recursive-diff';

let [a, b, c, delta] = [];
// testing primitive data type
a = 3;
b = 10;
delta = getDiff(a, b);
console.log(delta);
// Output: [{path: [], op: 'update', val: 10}]
c = applyDiff(a, delta);
console.log(c); // Output: 10

// testing array
a = [1, 2];
b = [1, 30, 40];
delta = getDiff(a, b);
console.log(delta);
/** *
Output:
[
  { path: [1], op: 'update', val: 30 },
  { path: [2], op: 'add', val: 40 },
]
* */
c = applyDiff(a, delta);
console.log(c); // Output: [1,30,40]

// testing objects
a = {
  a: '10',
  b: '20',
  c: '30',
};
b = {
  a: '10',
  b: '40',
};
delta = getDiff(a, b);
console.log(delta);
/** * Output:
[
  { path: ['b'], op: 'update', val: 40 },
  { path: ['c'], op: 'delete', val: undefined },
]
* */
c = applyDiff(a, delta);
console.log(c); // Output: {a:'10', 'b':40}

// testing complex deep object
a = {
  b: [1, 2, [3, 4]],
  c: {
    c1: 20,
    c2: {
      c21: 'hello',
    },
    c3: 'India',
  },
};
b = {
  b: [1, 2, [4]],
  c: {
    c1: 20,
    c2: {
      c21: 'hi',
      c22: 'welcome',
    },
    c3: 'cosmic',
  },
};

delta = getDiff(a, b);
console.log(delta);
/**
Output:
[
  { path: ['b', 2, 0], op: 'update', val: 4 },
  { path: ['b', 2, 1], op: 'delete', val: undefined },
  { path: ['c', 'c2', 'c21'], op: 'update', val: 'hi' },
  { path: ['c', 'c2', 'c22'], op: 'add', val: 'welcome' },
  { path: ['c', 'c3'], op: 'update', val: 'cosmic' },
]
* */
c = applyDiff(a, delta);
console.log(c);
/** *Output
 {
    b: [1,2,[4]],
    c: {
        c1 : 20,
        c2 : {
            c21: 'hi',
            c22: 'welcome'
        },
        c3: 'cosmic'
    }
}
* */
