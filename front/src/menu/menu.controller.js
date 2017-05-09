app.controller('MenuController', ['vnaSocket', 'OrderService', '$state', '$mdDialog', 'DataService',
    function(vnaSocket, OrderService, $state, $mdDialog, DataService) {

  var vm = this;

  vm.mode = $state.params.mode || "order"; 
  
  var pizzas = DataService.getPizzas();
  var pastas = DataService.getPastas();

  vm.isEditing = function() {
    return vm.mode === "edit";
  };

  vm.typeFilter = $state.params.typeFilter;
  vm.selectedType = vm.typeFilter || "pizza";
  vm.types = {
    pizza: pizzas,
    pasta: pastas
  };

  vm.itemClicked = vm.isEditing() ? editMenuPrompt : createOrder;
  vm.addItemClicked = editMenuPrompt;

  function createOrder(name) {
    OrderService.createOrder(vm.selectedType, name);
  };

  function editMenuPrompt(name, event) {
    $mdDialog.show({
      locals: { name: name, type: vm.selectedType },
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