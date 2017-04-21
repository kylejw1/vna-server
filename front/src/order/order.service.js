app.service('OrderService', ["$http", "vnaSocket", "orders", function($http, vnaSocket, orders) {  

  vnaSocket.on("addOrder", function(order) {
    orders[order.id] = order;
  });

  return {

    getOrders: function() {
      return $http.get("/api/orders")
        .then(function(data) {
          return data.data;
        });
    },

    orderItem: function(type, name) {
      return $http.put("/api/order/" + type + "/" + item)
        .then(function(data) {
          return data.data;
        });
    }

  }

}]);