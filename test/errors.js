const { expect } = require('chai');
const diff = require('../src/recursive-diff');

describe('diff error tests', () => {
  it('Invalid delta', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = null;

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'No diff object is provided, Nothing to apply');
  });

  it('Invalid operation', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = {
      '/b': { operation: 'invalid' },
    };

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid operation: "invalid"');
  });

  it('Invalid path (Not starting with slash)', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = {
      not_valid: { operation: 'update' },
    };

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Diff path: "not_valid" is not valid');
  });

  it('Invalid value for operation', () => {
    const obj = null;

    const delta = {
      '/c': { operation: 'update', value: 'some value' },
    };

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid path: "/c" for object: null');
  });

  it('Invalid path (One key in path is empty)', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = {
      '/c//w': { operation: 'update' },
    };

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, `Invalid path: "/c//w" for object: ${JSON.stringify(obj, null, 2)}`);
  });

  it('Delete for invalid path for object', () => {
    const obj = {
      c: '10',
      w: '20',
    };

    const delta = {
      '/not_found/w': { operation: 'delete' },
    };

    expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, `Invalid path: "/not_found/w" for object: ${JSON.stringify(obj, null, 2)}`);
  });
});
