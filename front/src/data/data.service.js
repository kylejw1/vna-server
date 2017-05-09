app.service('DataService', ["$http", "vnaSocket", function($http, vnaSocket) {

  var types = {
    pizza: [],
    pasta: []
  };

  vnaSocket.on("connect", function() {
    initTypes();
  });

  vnaSocket.on("itemAdded", function(item) {
    if (item && item.type && item.name) {
      types[item.type].push(item.name);
    } else {
      console.error("Attempting to add invalid item", item);
    }
  });

  vnaSocket.on("itemRemoved", function(item) {
    try {
      _.remove(types[item.type], function(name) {
        return item.name === name; 
      });
    } catch(err) {
      console.error("Error removing item", err);
    }
  });

  function initTypes() {

    while(types.pizza.length) {
      types.pizza.pop();
    }
    while(types.pasta.length) {
      types.pasta.pop();
    }

    // Get initial list from server
    $http.get("/api/pizza").then(function(data) {
      _.forEach(data.data, function(pizza) {
        types.pizza.push(pizza);
      });
    });
    $http.get("/api/pasta").then(function(data) {
      _.forEach(data.data, function(pasta) {
        types.pasta.push(pasta);
      });
    });
  }

  return {

    getPizzas: function() {
      return types.pizza;
    },

    getPastas: function() {
      return types.pasta;
    },

    create: function(name, type) {
      return $http.put("/api/" + type + "?name=" + name);
    },

    delete: function(name, type) {
      return $http.delete("/api/data/" + type + "/" + name);
    }

  }

}]);