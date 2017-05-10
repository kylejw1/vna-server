
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
    })
    
    .state('main.about', {
      url: '^/about?name=About',
      views: {
        'left@main': {
          templateUrl: 'src/about/about.html',
          controller: 'AboutController',
          controllerAs: 'aboutCtrl'
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

  function showError(data) {
    $mdToast.showSimple(data);
    console.error("Upstream error :: " + data);
  }

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

  vnaSocket.on("error", showError);
  vnaSocket.on("vnaError", showError);

  vnaSocket.emitWithToken = function(event, data) {
    vnaSocket.emit(event, { data: data, token: null });
  };

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

app.run(function(DataService, OrderService, $timeout, $window) {
  // This is needed to ensure the data and order services are created so they can initialize their socket listeners
  // And retrieve an initial list of menu items and orders
  console.log("Ensuring services are created...");

  var time = new Date();
  time.setHours(7*24, 0, 0, 0);
  var msec = time.getTime() - (new Date()).getTime();
  console.log("Will auto refresh page at ", time);
  console.log("(" + msec + " msec)");

  $timeout(function() {
    console.log("Reloading window after long uptime (" + time + "msec)");
    $window.location.reload();
  }, msec);
});