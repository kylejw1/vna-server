
var app = angular.module('vna', ['ngMaterial', 'ui.router', 'btford.socket-io', 'onScreenKeyboard', 'ngCookies']);

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
app.factory('vnaSocket', ['socketFactory', '$mdToast', '$window', '$interval', '$cookies', 
    function(socketFactory, $mdToast, $window, $interval, $cookies) {
  var vnaSocket = socketFactory();

  vnaSocket.authEmit = function(event, data) {
    return vnaSocket.emit(event, { data: data, token: $cookies.get("token") });
  };

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

  function showError(data) {
    if ("error")
    $mdToast.showSimple(data);
    console.error("Upstream error :: " + data);
  }
  vnaSocket.on("authError", function(error) {
    console.log(error);
    authPrompt($mdToast, $window);
  });
  vnaSocket.on("error", showError);
  vnaSocket.on("vnaError", showError);

  return vnaSocket;
}]);

app.factory('httpInterceptor', ['$injector', '$window', '$q', function($injector, $window, $q) {

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

      var msg = res.status + " :: " + res.statusText;
      console.log("HTTP error :: ", msg);
      var mdToast = $injector.get("$mdToast");

      if (res.status === 401) {
        authPrompt(mdToast, $window);
      } else if (res.status > 0) {
        mdToast.showSimple(msg);
      }

      return $q.reject(res);
    }
  };
}]);

function authPrompt($mdToast, $window) {
  var toast = $mdToast.simple()
    .textContent('Unauthorized')
    .action("LOGIN")
    .highlightAction(true);

  $mdToast.show(toast).then(function(response) {
    if (response === 'ok') {
      $window.location.reload();
    }
  }).catch(function(err) {
    console.log("User decided not to log in");
  });
}

app.run(function(AuthService, DataService, OrderService, $timeout, $window, $mdDialog) {
  // DataService, OrderService are injected to ensure they are created so they can initialize their socket listeners
  // And retrieve an initial list of menu items and orders
  console.log("Ensuring services are created...");
  var time = new Date();
  time.setHours(7*24, 0, 0, 0);
  var msec = time.getTime() - (new Date()).getTime();
  console.log("Will auto refresh page at ", time);
  console.log("(" + msec + " msec)");

  AuthService.getUser()
    .then(function(data) { 
      if (!data || data.status >= 400) {
        throw new Error("Not Authorized");
      }  
      console.log("Welcome, " + data.data) 
    })
    .catch(function(err) {
        $mdDialog.show({
          locals: { },
          controller: 'AuthController',
          controllerAs: 'authCtrl',
          templateUrl: 'src/auth/auth.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose:false,
        });
    });

  $timeout(function() {
    console.log("Reloading window after long uptime (" + time + "msec)");
    $window.location.reload();
  }, msec);
});