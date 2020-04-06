const assert = require('assert');
const diff = require('../src/recursive-diff');

let a; let b; let delta; let c;

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

  it('testing object with different types', () => {
    a = {
      a: 10,
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


  it('testing Null ', () => {
    a = null;
    b = {
      a: '10',
      b: '40',
    };
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta);
    assert.deepEqual(b, c);
  });

  it('testing Undefined ', () => {
    let d;
    const e = {
      a: '10',
      b: '40',
    };
    delta = diff.getDiff(d, e);
    c = diff.applyDiff(d, delta);
    assert.deepEqual(e, c);
  });

  it('testing undefined flipped', () => {
    let d;
    const e = {
      a: '10',
      b: '40',
    };
    delta = diff.getDiff(e, d);
    c = diff.applyDiff(e, delta);
    assert.equal(d, c);
  });

  it('testing Undefined, once more :) ', () => {
    a = {
      a: 4,
      b: undefined,
    };
    b = {
      a: undefined,
      b: '40',
    };
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta);
    assert.equal(b.a, c.a);// to check undefined
    assert.equal(b.b, c.b);
  });

  it('testing Undefined and null together ;)', () => {
    a = {
      a: 4,
      b: undefined,
    };
    b = {
      a: null,
      b: '40',
    };
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta);
    assert.equal(b.a, c.a);// to check undefined
    assert.equal(b.b, c.b);
  });

  it('testing visitor callback', () => {
    // TODO: use sinon.spy to count function call
    a = {
      a: 4,
      b: {
        c: 11,
      },
    };
    b = {
      a: 'hello',
      b: {
        d: 12,
      },
    };
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta, () => {});
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
    assert.deepEqual(delta, []); // no diff as dates are same
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
      d: null,
    };
    delta = diff.getDiff(a, b);
    c = diff.applyDiff(a, delta, () => {});
    assert.deepEqual(b, c);
  });
  it('testing diff format if oldValue is needed into diff', () => {
    a = {
      a: {
        b: 1,
        c: 2,
        d: [1],
      },
    };
    b = {
      a: {
        b: 2,
        d: [1, 2],
      },
    };
    const expectedDiff = [
      {
        op: 'update',
        path: [
          'a',
          'b',
        ],
        val: 2,
        oldVal: 1,
      },
      {
        op: 'delete',
        path: [
          'a',
          'c',
        ],
        oldVal: 2,
      },
      {
        op: 'add',
        path: [
          'a',
          'd',
          1,
        ],
        val: 2,
      },
    ];
    delta = diff.getDiff(a, b, true); // old value in the diff
    assert.deepEqual(delta, expectedDiff);
    delete expectedDiff[0].oldVal;
    delete expectedDiff[1].oldVal;
    delta = diff.getDiff(a, b); // no old value in the diff
    assert.deepEqual(delta, expectedDiff);
  });
});
