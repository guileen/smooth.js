Smooth.js
====

module(limitation, max_queue)
----

```js
var limit = 5;
var smooth = require('smooth')(limit);
```

smooth(fn, [limit, [max_queue]])
----

smooth a function
```js
foo = smooth(foo);
```

smooth a method of class.
```js
RedisClient.prototype.get = smooth(RedisClient.prototype.get);
```

smooth a method of object.
```js
redisClient.get = smooth(redisClient.get)
```