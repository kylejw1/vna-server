app.controller('MenuController', ['vnaSocket', 'pizzas', 'pastas', 'OrderService', '$state', 
    function(vnaSocket, pizzas, pastas, OrderService, $state) {

  var vm = this;

  vm.typeFilter = $state.params.typeFilter;
  vm.selectedType = vm.typeFilter || "pizza";
  vm.types = {
    pizza: pizzas,
    pasta: pastas
  };

  vm.createOrder = function(name) {
    OrderService.createOrder(vm.selectedType, name);
  };

}]);