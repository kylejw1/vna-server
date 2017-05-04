app.controller('EditMenuController', [ '$mdDialog', 'name', '$scope',
    function($mdDialog, name, $scope) {

  var vm = this;

  vm.name = name;

  vm.hide = function() {
    $mdDialog.hide();
  };

  vm.saveClicked = function() {
    vm.hide();
  };

  vm.cancelClicked = function() {
    vm.hide();
  };

  vm.timeout = setTimeout(function(){
    document.getElementsByTagName('INPUT')[0].focus();
  }, 150);

  $scope.$on('$destroy', function() {
    $timeout.cancel(vm.timeout);
  });

}]);

