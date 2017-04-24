app.controller('EditStatusController', [ '$mdDialog',
    function($mdDialog) {

  var vm = this;

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

