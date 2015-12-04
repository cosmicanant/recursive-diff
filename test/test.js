var diff = require('../index.js');
var assert = require('assert');

var a, b, delta, c;

describe("diff tests", function() {

    it("testing primitive data type", function() {
        a = 3;
        b = 10;
        delta = diff.getDiff(a, b);
        c = diff.applyDiff(a, delta);
        assert.equal(b, c);
    });

    it("testing array", function() {
        a = [1, 2, 3, 4];
        b = [2, 3, 4];
        delta = diff.getDiff(a, b);
        //console.log(delta);
        c = diff.applyDiff(a, delta);
        assert.deepEqual(b, c);
    });

    it("testing object ", function() {
        a = {
            a: '10',
            b: '20'
        };
        b = {
            a: '10',
            b: '40'
        };
        delta = diff.getDiff(a, b);
        c = diff.applyDiff(a, delta);
        assert.deepEqual(b, c);
    });

    it("testing complex deep object", function() {
        var fn = function() {}; //two function can be equal if they hold same reference
        a = {
            a: fn,
            b: [1, 2, [3, 4]],
            c: {
                c1: 20,
                c2: {
                    c21: 'hello'
                },
                c3: 'India'
            }
        };
        b = {
            a: fn,
            b: [1, 2, [4]],
            c: {
                c1: 20,
                c2: {
                    c21: 'hi',
                    c22: 'welcome'
                },
                c3: 'cosmic'
            }
        };

        //console.log('Object1 is:')
        //console.log(a);
        //console.log('Object2 is:')
        //console.log(b);
        delta = diff.getDiff(a, b);
        //console.log('Diff calculated is:')
        //console.log(delta);
        c = diff.applyDiff(a, delta);
        assert.deepEqual(b, c);
    });
});