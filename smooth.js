function smooth(fn, limit, maxQueueSize) {

  var queue = [];
  var running = 0;
  if(!limit) {
    limit = 10;
  }
  if(limit < 1) {
    limit = 1;
  }

  function loadNext() {
    var task = queue.shift();
    if(!task) return;
    var self = task[0];
    var args = task[1];
    var callback = args[args.length - 1];
    args[args.length - 1] = function() {
      running --;
      callback.apply(null, Array.prototype.slice.call(arguments));
      loadNext();
    };
    running ++;
    fn.apply(self, args);
  }

  function start() {
    if(running < limit) loadNext();
  }

  return function() {
    var args = Array.prototype.slice.call(arguments);
    queue.push([this, args]);
    if(queue.size > maxQueueSize) {
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
