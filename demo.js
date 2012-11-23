var smooth = require('./smooth')(5, 10);

var Client = function(id){
  this.id = id;
}

Client.prototype.get = function(a, b, c, callback){
  console.log(this.id);
  setTimeout(function(){
      console.log(a, b, c);
      callback(a, b, c);
  }, 200);
}

var client = new Client('x');
client.get = smooth(client.get);
for(var i = 0; i < 100; i++) {
  client.get('a', 'b', i, function(x, y, z){
      console.log('return ', x, y, z);
  });
}
