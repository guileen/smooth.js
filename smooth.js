function smooth(fn, limit, maxQueueSize, timeout) {

  var queue = [];
  var running = 0;
  timeout = timeout || 5000;
  if(!limit) {
    limit = 10;
  }
  if(limit < 1) {
    limit = 1;
  }

  function loadNext() {
    var task = queue.shift();
    if(warned && queue.length < maxQueueSize) {
      console.info('queue size is OK, fn: ' + fn);
      warned = false;
    }
    if(!task) return;
    var self = task[0];
    var args = task[1];
    var callback = args[args.length - 1];
    var alreadyCallback = false;
    // replace last arguments callback
    args[args.length - 1] = function() {
      if(alreadyCallback) return;
      clearTimeout(timer);
      running --;
      callback.apply(null, Array.prototype.slice.call(arguments));
      alreadyCallback = true;
      loadNext();
    };
    // callback if not callback for a long time
    var timer = setTimeout(function(){
        if(alreadyCallback) return;
        running --;
        callback(new Error('smooth timeout, args:' + args));
        alreadyCallback = true;
        loadNext();
    }, timeout);
    running ++;
    fn.apply(self, args);
  }

  function start() {
    if(running < limit) loadNext();
  }

  var warned = false;

  return function() {
    var args = Array.prototype.slice.call(arguments);
    queue.push([this, args]);
    if(!warned && queue.length > maxQueueSize) {
      warned = true;
      console.warn('exceed max queue size, fn: ' + fn);
    }
    start();
  }
}

var exports = module.exports = function(limit, max) {
  return function(fn, _limit, _max){
    return smooth(fn, _limit || limit, _max || max);
  }
}
