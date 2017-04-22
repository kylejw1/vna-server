
var app = angular.module('vna', ['ngMaterial', 'ui.router', 'btford.socket-io']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  $stateProvider
    
    .state('main', {
      url: '/',
      templateUrl: 'src/main.html',
      controller: 'MainController',
      controllerAs: 'mainCtrl',
      abstract: true
    })
    
    .state('main.order', {
      url: '^/order',
      views: {
        'left@main': {
          templateUrl: 'src/order/order.html',
          controller: 'OrderController',
          controllerAs: 'orderCtrl'
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

  $urlRouterProvider.otherwise('/order');

  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('teal')
    .warnPalette('red')
    .backgroundPalette('grey');

});

app.factory('vnaSocket', function(socketFactory) {
  var vnaSocket = socketFactory();
  return vnaSocket;
});