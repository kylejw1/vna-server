app.controller('EditStatusController', [ '$mdDialog', 'order', 'OrderService',
    function($mdDialog, order, OrderService) {

  var vm = this;

  vm.minutes = 0;
  vm.seconds = 0;

  vm.order = order;

  vm.hide = function() {
    $mdDialog.hide();
  };

  vm.startClicked = function() {
    var seconds = (parseInt(vm.minutes) * 60) + parseInt(vm.seconds); 
    OrderService.startTimer(order);
  };

  vm.cancelClicked = function() {
    $mdDialog.cancel();
  };

  vm.deleteClicked = function() {
    OrderService.deleteOrder(order.id);
    vm.hide();
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

  Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }

}]);

