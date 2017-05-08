app.service('DataService', ["$http", function($http) {

  return {

    getAllByName: function(name) {
      return $http.get("/api/" + name)
        .then(function(data) {
          return data.data;
        });
    },

    create: function(name, type) {
      return $http.put("/api/" + type + "?name=" + name);
    },

    delete: function(name, type) {
      return $http.delete("/api/data/" + type + "/" + name);
    }

  }

}]);