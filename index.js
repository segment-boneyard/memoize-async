
var nextTick = require('next-tick')
  , slice    = Array.prototype.slice;


module.exports = memoize;


/**
 * Memoize a function so it is only called once.
 * @param  {Function} fn
 * @param  {Function} keyFn     how to transform the arguments into a key
 * @return {Function} memoized  the memoized function
 */
function memoize (fn, keyFn) {
  keyFn || (keyFn = function (key) { return key; });

  var cached    = {}
    , callbacks = {};

  return function () {

    var args = initial(arguments)
      , cb   = last(arguments)
      , key  = keyFn(args);

    if (key in cached) {
      return nextTick(function () { cb.apply(cb, toRes(null, cached[key])); });
    }

    // replace the old callback function
    callbacks[key] = callbacks[key] || [];
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

  for (var i = 0; i < callbacks[key].length; i++) {
    var callback = callbacks[i];
    callback[i].apply(callback, args);
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
  return [err] + args;
}
