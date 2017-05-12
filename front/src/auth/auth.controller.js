app.controller('AuthController', [ '$mdDialog', '$window', 'AuthService',
    function($mdDialog, $window, AuthService) {

  var vm = this;

  vm.password = null;

  vm.hide = function() {
    $mdDialog.hide();
  };

  vm.cancelClicked = function() {
    vm.hide();
  };

  vm.loginClicked = function() {
    AuthService.login(vm.password.trim()).then(function(data) {
      $window.location.reload();
    });
  };

}]);

