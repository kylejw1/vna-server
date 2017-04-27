app.controller('MenuController', ['vnaSocket', 'pizzas', 'pastas', 'OrderService', 
    function(vnaSocket, pizzas, pastas, OrderService) {

  var vm = this;

  vm.selectedType = "pizza";
  vm.types = {
    pizza: pizzas,
    pasta: pastas
  };

  vm.createOrder = function(name) {
    OrderService.createOrder(vm.selectedType, name);
  };

}]);