const assert = require('assert');
const diff = require('../src/recursive-diff');

let a; let b; let delta; let
  c;

describe('diff tests', () => {
  it('testing primitive data type', () => {
    a = 3;
    b = 10;
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta);
    assert.equal(b, c);
  });

  it('testing array', () => {
    a = [1, 2, 3, 4];
    b = [2, 3, 4];
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta);
    assert.deepEqual(b, c);
  });
  it('testing object ', () => {
    a = {
      a: '10',
      b: '20',
    };
    b = {
      a: '10',
      b: '40',
    };
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta);
    assert.deepEqual(b, c);
  });

  it('testing date diffs ', () => {
    const dt1 = new Date();
    const dt2 = new Date(dt1.getTime());
    a = {
      a: dt1,
      b: '20',
    };
    b = {
      a: dt2,
      b: '20',
    };
    delta = diff.getDiff(a, b);
    assert.deepEqual(delta, {}); // no diff as dates are same
  });

  it('testing date diffs ', () => {
    const dt1 = new Date();
    const dt2 = new Date('2018-05-05');
    a = {
      a: dt1,
      b: '20',
    };
    b = {
      a: dt2,
      b: '20',
    };
    delta = diff.getDiff(a, b);
    assert.notDeepEqual(delta, {}); // diff as dates are same
  });

  it('testing complex deep object', () => {
    function fn() {} // two function can be equal if they hold same reference
    a = {
      a: fn,
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
      a: fn,
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

    // console.log('Object1 is:')
    // console.log(a);
    // console.log('Object2 is:')
    // console.log(b);
    delta = diff.getDiff(a, b);
    // console.log('Diff calculated is:')
    // console.log(delta);
    c = diff.applyDiff(a, delta);
    assert.deepEqual(b, c);
  });
});
