app.service('OrderService', ["$http", "vnaSocket", "$timeout", function($http, vnaSocket, $timeout) {  

  var orders = [];

  // Subscribe to pushed orders
  vnaSocket.on("orderAdded", function(order) {
    if (!_.find(orders, {id: order.id})) {
      orders.push(order);
    }
  });

  vnaSocket.on("orderUpdated", function(order) {

  });

  // Request all existing orders from the server
  $http.get("/api/orders").then(function(data) {
    _.forEach(data.data, function(order) {
      if (!_.find(orders, {id: order.id})) {
        orders.push(order);
      }
    });
  });

  function updateTimes() {
    var staleTime = new Date().getTime() - 60000;

    _.remove(orders, function(order) { return order.requestTime < staleTime; });
  }

  function updateTimer() {
    $timeout(function() {
      try {
        updateTimes();
      } catch(err) {
        console.error(err);
      }
      updateTimer();
    }, 1000);
  }
  updateTimer();

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
    },

    updateOrder: function(id, params) {
      vnaSocket.emit("updateOrder", params);
    }

  }

}]);