
# memoize-async

  Memoize the results of async functions

## Installation

    $ component install segmentio/memoize-async

## API

  ```javascript
  var memoize = require('..');

  User.get = memoize(User.get);

  User.get('a@a.com', function (err, user) {
    // do some stuff
  });

  // ... later we will immediately get the user

  User.get('a@a.com', function (err, user) {

  });


  ```



## License

  MIT
