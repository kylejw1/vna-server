app.controller('OrderController', ['vnaSocket', 'pizzas', 'pastas', function(vnaSocket, pizzas, pastas) {

  var vm = this;

  vm.type = "pizza";
  vm.names = pizzas;

  vm.createOrder = function(name) {

    var order = {
      name: name,
      type: vm.type
    };

    vnaSocket.emit("createOrder", order);
  }

}]);