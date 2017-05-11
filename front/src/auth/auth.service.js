app.service('AuthService', ["$http", function($http) {

  return {
    
    login: function() {
      $http.post("/api/auth/login", { user: "verona", pass: "imhungry" })
    },

    logout: function() {
      $http.post("/api/auth/logout");
    }
  }

}]);