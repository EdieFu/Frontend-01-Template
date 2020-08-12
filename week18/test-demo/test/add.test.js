let mod = require('../src/add');
//var mod = require('../dist/add');
let assert = require('assert');

/*
describe('Array', function () {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
});
*/

describe('add', function () {   
    it('add(3, 4) should be', function () {
        assert.equal(mod.add(3, 4), 7);
    });
});