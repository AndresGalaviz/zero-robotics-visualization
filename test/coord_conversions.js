var assert = require('chai').assert
var requirejs = require('requirejs');

requirejs.config({
    baseUrl: '.',
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

// I couldn't figure out how to set the testing environment properly. Sorry :(
var Helpers = requirejs('../zr_vis/out/scripts/scripts/Helpers');

describe('Helpers', function() {
  describe('#convertCoords()', function () {
    it('should convert test cases correctly', function () {
      var res = Helpers.convertCoords([1,2,3]);
      var exp = [100, -300, 200];

      assert.closeTo(res[0], exp[0], 0.001);
      assert.closeTo(res[1], exp[1], 0.001);
      assert.closeTo(res[2], exp[2], 0.001);

      var res = Helpers.convertCoords([0.4, -0.6, 0]);
      var exp = [40, 0, -60];

      assert.closeTo(res[0], exp[0], 0.001);
      assert.closeTo(res[1], exp[1], 0.001);
      assert.closeTo(res[2], exp[2], 0.001);
    });
    it('should unconvert coords correctly', function() {
      var arg = [1, 2, 3];
      var unc = Helpers.unconvertCoords(Helpers.convertCoords(arg))

      assert.closeTo(arg[0], unc[0], 0.001);
      assert.closeTo(arg[1], unc[1], 0.001);
      assert.closeTo(arg[2], unc[2], 0.001);

      var arg = [0.4, -0.6, 0];
      var unc = Helpers.unconvertCoords(Helpers.convertCoords(arg))

      assert.closeTo(arg[0], unc[0], 0.001);
      assert.closeTo(arg[1], unc[1], 0.001);
      assert.closeTo(arg[2], unc[2], 0.001);
    });
  });

  describe("#convertQuat)()", function() {
    it('should convert quaternions correctly', function() {

    });
  });
});
