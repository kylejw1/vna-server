app.controller('EditMenuController', [ '$mdDialog', 'name', 'type', '$scope', 'DataService', '$timeout',
    function($mdDialog, name, type, $scope, DataService, $timeout) {

  var vm = this;

  vm.name = name;

  vm.hide = function() {
    $mdDialog.hide();
  };

  vm.deleteClicked = function() {
    DataService.delete(name, type);
    vm.hide();
  };

  vm.saveClicked = function() {
    if (vm.name !== name) {
      DataService.delete(name, type);
      DataService.create(vm.name, type);
    }
    vm.hide();
  };

  vm.cancelClicked = function() {
    vm.hide();
  };

  vm.timeout = setTimeout(function(){
    document.getElementsByTagName('INPUT')[0].focus();
  }, 150);

  $scope.$on('$destroy', function() {
    try {
      $timeout.cancel(vm.timeout);
    } catch(err) {
      console.log(err);
    }
  });

}]);

