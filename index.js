
var nextTick = require('next-tick');


/**
 * Utility methods
 */

var slice = Array.prototype.slice;
var has = Object.hasOwnProperty;


/**
 * Module exports
 */

module.exports = memoize;


/**
 * Memoize a function so it is only called once.
 * @param  {Function} fn
 * @param  {Function} keyFn     how to transform the arguments into a key
 * @return {Function} memoized  the memoized function
 */

function memoize (fn, keyFn) {
  keyFn || (keyFn = function (key) { return key; });

  var cached = {};
  var callbacks = {};

  return function () {
    var args = initial(arguments);
    var cb = last(arguments);
    var key = keyFn.apply(keyFn, args);

    if (has.call(cached, key)) {
      return nextTick(function () { cb.apply(cb, toRes(null, cached[key])); });
    }

    if (has.call(callbacks, key)) return callbacks[key].push(cb);

    callbacks[key] = [];
    callbacks[key].push(cb);

    args.push(onFinish);
    fn.apply(fn, args);

    function onFinish (err) {
      if (!err) cached[key] = rest(arguments); // save our res only on success
      respond(callbacks[key], arguments); // callback
      delete callbacks[key];
    }
  };
}


/**
 * Respond to all of our saved callbacks with the proper args
 * @param  {Array} callbacks
 * @param  {Array} args
 */

function respond (callbacks, args) {
  if (!callbacks) return;

  for (var i = 0; i < callbacks.length; i++) {
    var callback = callbacks[i];
    callback.apply(callback, args);
  }
}


/**
 * Return all but the last argument from the array
 */

function initial (args) {
  return slice.apply(args, [0, -1]);
}


/**
 * Return all but the first argument from the array
 */

function rest (args) {
  return slice.apply(args, [1]);
}


/**
 * Return only the last argument from the array
 */

function last (args) {
  return args[args.length - 1];
}


/**
 * Turn an error and arguments object into a proper callback array
 */

function toRes (err, args) {
  return [err].concat(args);
}
