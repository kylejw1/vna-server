app.service('OrderService', ["$http", "vnaSocket", "$timeout", function($http, vnaSocket, $timeout) {  

  var orders = {};

  // Subscribe to pushed orders
  vnaSocket.on("orderAdded", function(order) {
    if (!order.id) {
      console.error("orderAdded :: No id provided");
    }
    orders[order.id] = order;
  });

  vnaSocket.on("orderUpdated", function(order) {
    if (!orders[order.id]) {
      console.error("Received update for unknown order, id=" + order.id);
    }

    _.assign(orders[order.id], order);
  });

  // Request all existing orders from the server
  $http.get("/api/orders").then(function(data) {
    _.forEach(data.data, function(order) {
      if (order.id) {
        orders[order.id] = order;
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

    updateOrder: function(orderData) {
      vnaSocket.emit("updateOrder", orderData);
    }

  }

}]);