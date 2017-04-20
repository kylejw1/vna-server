
var app = angular.module('vna', ['ngMaterial', 'ui.router', 'btford.socket-io']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  $stateProvider
    
    .state({
      name: 'main',
      url: '/',
      templateUrl: 'src/main.html',
      controller: 'MainController',
      controllerAs: 'mainCtrl',
      abstract: true
    })
    
    .state({
      name: 'main.order',
      url: '^/order',
      templateUrl: 'src/order/order.html',
      controller: 'OrderController',
      controllerAs: 'orderCtrl',
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