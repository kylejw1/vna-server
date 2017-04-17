
var app = angular.module('vna', ['ngMaterial', 'ui.router', 'btford.socket-io']);

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state({
    name: 'main',
    url: '/',
    templateUrl: 'view/main.html',
    controller: 'MainController',
    controllerAs: 'mainCtrl'
  });

  $urlRouterProvider.otherwise('/');

});

app.factory('vnaSocket', function(socketFactory) {
  var vnaSocket = socketFactory();
  return vnaSocket;
});