
var memoize = require('..')
  , assert  = require('assert');


describe('memoize-async', function () {

  it('should only call back the same value once', function (done) {
    var count = [];

    function async (index, cb) {
      setTimeout(function () {
        count[index] = count[index] || index;
        count[index] += 1;
        cb(null, count[index]);
      }, 10);
    }

    var memoized = memoize(async);
    memoized(0, function (err, result) { assert(result === 1); });
    memoized(0, function (err, result) { assert(result === 1); });
    memoized(1, function (err, result) { assert(result === 2); });
    setTimeout(done, 40);
  });

  it('should use a key function', function (done) {
    function callback (index, cb) { cb(null, index + 5); }
    var memoized = memoize(callback, function (i) { return i % 3; });
    memoized(0, function (err, result) { assert(result === 5); });
    memoized(3, function (err, result) { assert(result === 5); });
    memoized(10, function (err, result) { assert(result === 15); });
    memoized(1, function (err, result) { assert(result === 15); });
    setTimeout(done, 10);
  });
});


