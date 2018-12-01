var expect = require('chai').expect;
var diff = require('../index.js');

describe("diff error tests", function() {

    it('Invalid delta', function() {
      var obj = {
        c: '10',
        w: '20'
      };

      var delta = null;

      expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'No diff object is provided, Nothing to apply');
    });

    it('Invalid operation', function() {
      var obj = {
        c: '10',
        w: '20'
      };

      var delta = {
        '/b': {operation: 'invalid'}
      };

      expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid operation: "invalid"');
    });

    it('Invalid path (Not starting with slash)', function() {
      var obj = {
        c: '10',
        w: '20'
      };

      var delta = {
        'not_valid': {operation: 'update'}
      };

      expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Diff path: "not_valid" is not valid');
    });

    it('Invalid value for operation', function() {
      var obj = null;

      var delta = {
        '/c': {operation: 'update', value: 'some value'}
      };

      expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid path: "/c" for object: null');
    });

    it('Invalid path (One key in path is empty)', function() {
      var obj = {
        c: '10',
        w: '20'
      };

      var delta = {
        '/c//w': {operation: 'update'}
      };

      expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid path: "/c//w" for object: ' + JSON.stringify(obj, null, 2));
    });

    it('Delete for invalid path for object', function() {
      var obj = {
        c: '10',
        w: '20'
      };

      var delta = {
        '/not_found/w': {operation: 'delete'}
      };

      expect(diff.applyDiff.bind(diff.applyDiff, obj, delta)).to.throw(Error, 'Invalid path: "/not_found/w" for object: ' + JSON.stringify(obj, null, 2));
    });
});
