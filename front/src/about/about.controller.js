app.controller('AboutController', [ '$mdDialog', 'DataService', 'AuthService',
    function($mdDialog, DataService, AuthService) {

  var vm = this;

  DataService.getVersion().then(function(version) {
    vm.version = version;
  });

  AuthService.getUser().then(function(user) {
    vm.user = user;
  }).catch(function(err) {
    vm.user = "(not logged in)"
  });

  vm.restartClicked = function(ev) {
    var confirm = $mdDialog.confirm()
          .title('Restart Server?')
          .textContent('Are you sure you want to restart the server?  This will clear all current orders.')
          .ariaLabel('Restart Server')
          .targetEvent(ev)
          .ok('Restart')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      console.log("Requesting Restart...");
      DataService.restartServer();
    });
  };

}]);

