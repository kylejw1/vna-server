
var app = angular.module('vna', ['ngMaterial', 'ui.router']);

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