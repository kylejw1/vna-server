app.controller('MainController', ['vnaSocket', function(vnaSocket) {

  var vm = this;

  vm.setChannel = function(channel) {
    console.log("Setting channel " + channel);
    vm.broadCast();
  };

  vm.broadCast = function() {
    vnaSocket.emit("message", "hello server");
  };

  vnaSocket.on('message', function(data) {
    console.log("Received message: " + JSON.stringify(data));
  });

}]);