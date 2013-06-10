
var memoize = require('..')
  , assert  = require('assert');

var count = [];

function async (index, cb) {
  setTimeout(function () {
    count[index] = count[index] || index;
    count[index] += 1;
    cb(null, count[index]);
  }, 100);
}

var memoized = memoize(async);

memoized(0, function (err, result) {
  assert(result === 1);
});

memoized(0, function (err, result) {
  assert(result === 1);
});

memoized(1, function (err, result) {
  assert(result === 2);
});