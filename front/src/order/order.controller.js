app.controller('OrderController', ['vnaSocket', 'pizzas', 'pastas', function(vnaSocket, pizzas, pastas) {

  var vm = this;

  vm.types = pizzas;

  vm.order = function(type) {
    vm.broadCast = function() {
      vnaSocket.emit("order", type);
    };
  }

}]);