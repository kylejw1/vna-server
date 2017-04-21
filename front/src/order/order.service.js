app.service('OrderService', ["$http", "vnaSocket", function($http, vnaSocket) {  

  var orders = {};

  // Subscribe to pushed orders
  vnaSocket.on("addOrder", function(order) {
    orders[order.id] = order;
  });

  // Request all existing orders from the server
  $http.get("/api/orders").then(function(data) {
      _.forEach(data.data, function(order) {
        orders[order.id] = order;
      });
  });

  return {

    getOrders: function() {
      return orders;
    },

    createOrder: function(type, name) {
      var order = {
        name: name,
        type: type
      };

      vnaSocket.emit("createOrder", order);
    }

  }

}]);