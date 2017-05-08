
var app = angular.module('vna', ['ngMaterial', 'ui.router', 'btford.socket-io', 'onScreenKeyboard']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider) {

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
      url: '^/menu?name&typeFilter&columns&mode',
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
      }
    });

  $urlRouterProvider.otherwise('/menu');

  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('blue')
    .warnPalette('red')
    .backgroundPalette('grey');

  $httpProvider.interceptors.push('httpInterceptor');

});

var currentVersion = null;
app.factory('vnaSocket', ['socketFactory', '$mdToast', '$window', '$interval', 
    function(socketFactory, $mdToast, $window, $interval, menuController) {
  var vnaSocket = socketFactory();

  vnaSocket.on("version", function(data) {

    var version = data.version;
    if (currentVersion && currentVersion !== version) {
      $mdToast.showSimple("Version mismatch: " + currentVersion + " -> " + version);
      $interval(function() {
        $window.location.reload();
      }, 3000, 1);
    } else {
      currentVersion = version;
    }
    console.log("Back end version: " + version);
    console.log("Uptime: " + data.uptime);//.substr(11, 8));
  });

  vnaSocket.on("error", function(data) {
    $mdToast.showSimple(data);
    console.error("Upstream error :: " + data);
  });

  return vnaSocket;
}]);

app.factory('httpInterceptor', ['$injector', function($injector) {


  return {
        request: function(config) {
      return config;
    },

    requestError: function(config) {
      return config;
    },

    response: function(res) {
      return res;
    },
    responseError: function(res) {
      var mdToast = $injector.get("$mdToast");
      var msg = res.status + " :: " + res.statusText;
      mdToast.showSimple(msg);
      console.error("HTTP error :: ", msg);
      return res;
    }
  };
}]);