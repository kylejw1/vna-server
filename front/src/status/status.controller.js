app.controller('StatusController', [ 'OrderService', '$mdDialog',
    function(OrderService, $mdDialog) {

  var vm = this;

  // Get the orders reference.  This collection is updated in real time by the socket
  vm.orders = OrderService.getOrders();
  vm.timeLeft = OrderService.getTimeLeft();

  vm.orderClicked = function(ev, order) {
    $mdDialog.show({
      locals: { order: order },
      controller: 'EditStatusController',
      controllerAs: 'editStatusCtrl',
      templateUrl: 'src/status/edit.status.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      vm.status = 'You said the information was "' + answer + '".';
    }, function() {
      vm.status = 'You cancelled the dialog.';
    });
  };

}]);