
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
        },
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
      },
      abstract: true
    })

    .state('main.front', {
      url: '^/front',
      config: {
        station: "Front",
        itemTypeFilter: null
      }
    });
    
  $urlRouterProvider.otherwise('/front');

  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('blue')
    .warnPalette('red')
    .backgroundPalette('grey');

});

app.factory('vnaSocket', function(socketFactory) {
  var vnaSocket = socketFactory();

  vnaSocket.on("error", function(data) {
    console.error("Upstream error :: " + data);
  });

  return vnaSocket;
});