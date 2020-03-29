const { expect } = require('chai');
const diff = require('../src/recursive-diff');

describe('diff error tests', () => {
  it('Invalid delta', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = null;

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid diff format');
  });

  it('Invalid operation', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = [{ path: ['b'], op: 'invalid' }];
    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Unsupported operation provided into diff object');
  });

  it('Invalid path (Not starting with slash)', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = [{ path: 'not_valid', op: 'update' }];
    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Diff path: "not_valid" is not valid');
  });

  it('Invalid value for operation', () => {
    const obj = null;

    const delta = [{ path: [null], op: 'update' }];
    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid path: "" for object: null');
  });

  it('Invalid path (One key in path is empty)', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = [{ path: ['a', null, 'b'], op: 'update' }];

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, `Invalid path: "a,,b" for object: ${JSON.stringify(obj, null, 2)}`);
  });

  it('Delete for invalid path for object', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = [{ path: ['a', 'b'], op: 'delete' }];
    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, `Invalid path: "a,b" for object: ${JSON.stringify(obj, null, 2)}`);
  });

  it('update op should throw error if invalid path provided', () => {
    const obj = {
      a: {
        b: 2,
      },
    };

    const delta = [{ path: ['a', null, 'd'], op: 'update' }];
    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, `Invalid path: "a,,d" for object: ${JSON.stringify(obj, null, 2)}`);
  });
});
