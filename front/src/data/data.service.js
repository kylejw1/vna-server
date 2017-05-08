app.service('DataService', ["$http", "vnaSocket", function($http, vnaSocket) {

  var items = {
    pizza: [],
    pasta: []
  };

  vnaSocket.on("connect", function() {
    initTypes();
  });

  vnaSocket.on("itemAdded", function(item) {
    if (item && item.type && item.name) {
      items[item.type].push(item.name);
    } else {
      console.error("Attempting to add invalid item", item);
    }
  });

  vnaSocket.on("itemRemoved", function(item) {
    try {
      _.remove(items[item.type], item.name);
    } catch(err) {
      console.error("Error removing item", err);
    }
  });

  function initTypes() {

    while(items.pizza.length) {
      items.pizza.pop();
    }
    while(items.pasta.length) {
      items.pasta.pop();
    }

    // Get initial list from server
    $http.get("/api/pizza").then(function(data) {
      _.forEach(data.data, function(pizza) {
        items.pizza.push(pizza);
      });
    });
    $http.get("/api/pasta").then(function(data) {
      _.forEach(data.data, function(pasta) {
        items.pasta.push(pasta);
      });
    });
  }

  return {

    getPizzas: function() {
      return items.pizza;
    },

    getPastas: function() {
      return items.pasta;
    },

    create: function(name, type) {
      return $http.put("/api/" + type + "?name=" + name);
    },

    delete: function(name, type) {
      return $http.delete("/api/data/" + type + "/" + name);
    }

  }

}]);