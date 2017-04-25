app.controller('EditStatusController', [ '$mdDialog', 'order', 'OrderService',
    function($mdDialog, order, OrderService) {

  var vm = this;

  vm.minutes = 0;
  vm.seconds = 0;

  vm.order = order;

  vm.hide = function() {
    $mdDialog.hide();
  };

  vm.cancel = function() {
    $mdDialog.cancel();
  };

  vm.answer = function(answer) {
    $mdDialog.hide(answer);
  };

  vm.deleteClicked = function() {
    OrderService.deleteOrder(order);
    $mdDialog.hide();
  };

  vm.incrementMinutes = function() {
    vm.minutes = vm.setMinutes(vm.minutes + 1);
  };

  vm.decrementMinutes = function() {
    vm.minutes = vm.setMinutes(vm.minutes - 1);
  };

  vm.incrementSeconds = function() {
    vm.seconds = vm.setSeconds(vm.seconds + 1);
  };

  vm.decrementSeconds = function() {
    vm.seconds = vm.setSeconds(vm.seconds - 1);
  };

  vm.setMinutes = function(value) {
    return constrain(value, 0, 99);
  };

  vm.setSeconds = function(value) {
    return constrain(value, 0, 59);
  };

  function constrain(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }

}]);

