
var app = angular.module('vna', ['ngMaterial', 'ui.router', 'btford.socket-io']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  $stateProvider
    
    .state('main', {
      url: '/',
      views: {
        '': {
          templateUrl: 'src/main.html',
          controller: 'MainController',
          controllerAs: 'mainCtrl'
        }
      },
      abstract: true
    })

    .state('main.menu', {
      url: '^/menu/:station?typeFilter&columns',
      views: {
        'left@main': {
          templateUrl: 'src/menu/menu.html',
          controller: 'MenuController',
          controllerAs: 'menuCtrl'
        },
        'right@main': {
          templateUrl: 'src/status/status.html',
          controller: 'StatusController',
          controllerAs: 'statusCtrl'
        }
      },
      resolve: {
        pizzas: function(DataService) { 
          return DataService.getAllByName("pizzas");
        },
        pastas: function(DataService) {
          return DataService.getAllByName("pastas");
        }
      }
    });

  $urlRouterProvider.otherwise('/menu/front');

  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('blue')
    .warnPalette('red')
    .backgroundPalette('grey');

});

var currentVersion = null;
app.factory('vnaSocket', ['socketFactory', '$mdToast', '$window', '$interval', function(socketFactory, $mdToast, $window, $interval) {
  var vnaSocket = socketFactory();

  vnaSocket.on("version", function(version) {

    var versionNumber = version.version;
    if (currentVersion && currentVersion !== versionNumber) {
      $mdToast.showSimple("Version mismatch: " + currentVersion + " -> " + versionNumber);
      $interval(function() {
        $window.location.reload();
      }, 3000, 1);
    } else {
      console.log("Back end version: " + versionNumber);
      currentVersion = versionNumber;
    }
    var date = new Date(null);
    date.setSeconds(version.uptime || 0); // specify value for SECONDS here
    console.log("Uptime: " + date.toISOString());//.substr(11, 8));
  });

  vnaSocket.on("error", function(data) {
    $mdToast.showSimple(data);
    console.error("Upstream error :: " + data);
  });

  return vnaSocket;
}]);