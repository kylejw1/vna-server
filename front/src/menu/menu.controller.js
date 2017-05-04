app.controller('MenuController', ['vnaSocket', 'pizzas', 'pastas', 'OrderService', '$state', '$mdDialog', 
    function(vnaSocket, pizzas, pastas, OrderService, $state, $mdDialog) {

  var vm = this;

  vm.mode = $state.params.mode || "order";

  vm.typeFilter = $state.params.typeFilter;
  vm.selectedType = vm.typeFilter || "pizza";
  vm.types = {
    pizza: pizzas,
    pasta: pastas
  };

  vm.buttonColor = vm.mode === "edit" ? 'red-100' : 'blue-100';

  vm.itemClicked = vm.mode === "edit" ? editMenuPrompt : createOrder;

  function createOrder(name) {
    OrderService.createOrder(vm.selectedType, name);
  };

  function editMenuPrompt(name, event) {
    $mdDialog.show({
      locals: { name: name },
      controller: 'EditMenuController',
      controllerAs: 'editMenuCtrl',
      templateUrl: 'src/menu/edit.menu.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
    });
  }

}]);