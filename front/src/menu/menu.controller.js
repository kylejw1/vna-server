app.controller('MenuController', ['vnaSocket', 'pizzas', 'pastas', 'OrderService', '$state', '$mdDialog', 
    function(vnaSocket, pizzas, pastas, OrderService, $state, $mdDialog) {

  var vm = this;

  vm.typeFilter = $state.params.typeFilter;
  vm.selectedType = vm.typeFilter || "pizza";
  vm.types = {
    pizza: pizzas,
    pasta: pastas
  };

  // vm.createOrder = function(name) {
  //   OrderService.createOrder(vm.selectedType, name);
  // };

  vm.createOrder = function(name) {
    editMenuPrompt(name, event);
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