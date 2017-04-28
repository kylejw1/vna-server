app.controller('StatusController', [ 'OrderService', '$mdDialog', '$state',
    function(OrderService, $mdDialog, $state) {

  var vm = this;
  
  // Get the orders reference.  This collection is updated in real time by the socket
  vm.orders = OrderService.getOrders();
  
  vm.orderClicked = function(event, order) {
    if (order.status !== "Complete") {
      return editStatusPrompt(order, event);
    } else {
      OrderService.deleteOrder(order.id);
    }
  };

  function editStatusPrompt(order, event) {
    $mdDialog.show({
      locals: { order: order },
      controller: 'EditStatusController',
      controllerAs: 'editStatusCtrl',
      templateUrl: 'src/status/edit.status.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
    });
  }

}]);