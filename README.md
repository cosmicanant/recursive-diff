 [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build][travis-image]][travis-url]
  [![Coverage Status][coveralls-image]][coveralls-url]
  [![Dependency Status](https://david-dm.org/cosmicanant/recursive-diff.svg)](https://david-dm.org/cosmicanant/recursive-diff)

# Recursive-Diff

## A JavaScript library (with TypeScript support) to find diff between two JS Objects/Array, support for complex nested JS Objects

* * *

This library can be used to get diff between two JS Objects/Arrays(or other primitive values). Diff are returned in the form of Array where each ARRAY item  represents a change in the original Object/Array. A diff item can have following three properties:

-   `path`: An array representation of nested path
-   `op`: Can be any one of the following - add, update or delete
-   `val`: New value after change


```
const rdiff = require('recursive-diff');
const initialVal = {
  a: {
    b: 1,
    c: 2,
    d: [1]
  }
}
const changedVal = {
  a: {
    b: 2,
    d: [1, 2],
  },
};

const diff = rdiff.getDiff(initialVal, changedVal);
/***
Diff of initialVal and changedVal is: [
  {
    "path": [
      "a",
      "b"
    ],
    "op": "update",
    "val": 2
  },
  {
    "path": [
      "a",
      "c"
    ],
    "op": "delete"
  },
  {
    "path": [
      "a",
      "d",
      1
    ],
    "op": "add",
    "val": 2
  }
]
**/

const c = rdiff.applyDiff(initialVal, diff);
assert.deepEqual(c, changedVal);

```

## Api details

-   **`getDiff(oldVal, newVal, keepOldVal?)`:** `getDiff` takes following parameters
    -   `oldVal (required)`:  initial value, can be Array/Object or even primitive type such as number, boolean or string
    -   `newVal (required)`: changed value ( required ), can be Array/Object or even primitive type such as number, boolean or string
    -   `keepOldValueInDiff (optional)`: boolean parameter which if set to true, every diff value will have an additional property `oldValue` which will denote the old value before mutation

-   **`applyDiff (oldVal, diff, visitorCallbackFn?)`** `applyDiff` takes three arguments:
    -   `oldVal (required)`: original value,
    -   `diff (required)`: diff returned by `getDiff` API
    -   `visitorCallbackFn (optional)`: This callback function is called at each depth level while applying the diff. It can be used to mark the mutation path with some meta properties eg: `{ isMutated: true }`. For more details, please check the examples directory of this repo.

## Using recursive diff library in Node

-   Install library using the command : `npm install recursive-diff`
-   sample code is given below

    ```
    const diff = require('recursive-diff');
    const oldVal = {a:1};
    const newVal = {a:2};
    const delta = diff.getDiff(oldVal, newVal);
    const ob3 = diff.applyDiff(oldVal, delta);
    assert.deepEqual(ob3, newVal);

    ```

## Using recursive diff library in the Browser

`'dist/recursive-diff.min.js'` can be directly injected into a HTML page using the URL `https://unpkg.com/recursive-diff@latest/dist/recursive-diff.min.js`. Once it is included into the HTML file, diff API is accessible using  `window.recursiveDiff`. Example given below.

    <script type="text" src="https://unpkg.com/recursive-diff@latest/dist/recursive-diff.min.js"/>
    <script type="text/javascript">
    const oldVal = { a: 1 };
    const newVal = { a: 2 };
    const delta = recursiveDiff.getDiff(oldVal, newVal);
    const ob3 = recursiveDiff.applyDiff(oldVal, delta); //expect ob3 is deep equal to newVal
    </script>

## Using recursive diff library in TypeScript

    import { getDiff, applyDiff, rdiffResult } from 'recursive-diff';

    const oldVal = [1, 2];
    const newVal = [2, 3, 4];
    const diff:rdiffResult[] = getDiff(oldVal, newVal);
    console.log('diff', diff);
    const final = applyDiff(oldVal, diff);
    console.log('applydiff', final); // final should deep equal to newVal

## Tests

Unit test can be run using the command `npm test`. This repo has more than 99% code coverage.

## Examples

You can find more examples in the example folder of this repo. Few of the examples are listed below.

```
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
delta = getDiff(a, b, true); // third parameter : keepOldValInDiff, see output below
console.log(delta);
/** *
Output:
[
  { path: [1], op: 'update', val: 30, oldVal: 2 },
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

```

[npm-image]: https://img.shields.io/npm/v/recursive-diff.svg

[npm-url]: https://npmjs.org/package/recursive-diff

[downloads-image]: https://img.shields.io/npm/dm/recursive-diff.svg

[downloads-url]: https://npmjs.org/package/recursive-diff

[travis-image]: https://img.shields.io/travis/cosmicanant/recursive-diff/master.svg

[travis-url]: https://travis-ci.org/cosmicanant/recursive-diff

[coveralls-image]: https://coveralls.io/repos/github/cosmicanant/recursive-diff/badge.svg?branch=master

[coveralls-url]: https://coveralls.io/github/cosmicanant/recursive-diff?branch=master
