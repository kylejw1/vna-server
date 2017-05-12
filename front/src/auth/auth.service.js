app.service('AuthService', ["$http", function($http) {

  return {
    
    login: function(pass) {
      return $http.post("/api/auth/login", { user: "verona", pass: pass })
    },

    logout: function() {
      return $http.post("/api/auth/logout");
    },

    getUser: function() {
      return $http.get('/api/auth/user').then(function(res) {
        return res.data;
      });
    }
  }

}]);