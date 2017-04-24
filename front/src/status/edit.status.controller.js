app.controller('EditStatusController', [ '$mdDialog', 'order',
    function($mdDialog, order) {

  var vm = this;

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

}]);

