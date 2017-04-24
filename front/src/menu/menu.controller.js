app.controller('MenuController', ['vnaSocket', 'pizzas', 'pastas', 'OrderService', 
    function(vnaSocket, pizzas, pastas, OrderService) {

  var vm = this;

  vm.type = "pizza";
  vm.names = pizzas;

  vm.createOrder = function(name) {
    OrderService.createOrder(vm.type, name);
  };

  vm.orderClicked = function(order) {
    OrderService.updateOrder(order.id, { status: "complete" });
  };

}]);