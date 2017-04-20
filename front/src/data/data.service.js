app.service('DataService', ["$http", function($http) {

  return {

    getAllByName: function(name) {
      return $http.get("/api/" + name)
        .then(function(data) {
          return data.data;
        });
    }

  }

}]);