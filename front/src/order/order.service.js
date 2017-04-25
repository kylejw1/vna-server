app.service('OrderService', ["$http", "vnaSocket", "$timeout", "$interval", function($http, vnaSocket, $timeout, $interval) {  

  var orders = {};

  var timeOffset = 0;

  var syncInterval = $interval(sync, 120000);
  sync();
  // var interval = $interval(updateOrders)

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

  vnaSocket.on("orderRemoved", function(id) {
    delete orders[id];
  });

  vnaSocket.on("orderTimerStarted", function(order) {
    var o = orders[order.id];
    o.secondsLeft = order.secondsLeft;
    o.color = 'green-100';
  });

  function sync() {

    // Update time offset (in case this device cannot reach a timeserver)
    $http.get("/api/time").then(function(data) {
      var now = new Date().getTime();
      timeOffset = now - parseInt(data.data); 
      console.log("Synced time offset (msec) :: " + timeOffset);
    }).catch(function(err) {
      console.error("Failed to sync time :: " + JSON.stringify(err));
    });
    
    // Request all existing orders from the server
    $http.get("/api/orders").then(function(data) {

      var serverOrders = data.data;

      var missingOrders = _.reject(orders, function(order) {
        return serverOrders[order.id];
      });

      _.forEach(missingOrders, function(order) {
        try {
          console.log("Removing order as it is missing from server :: " + order.id + " :: " + order.name);
          delete orders[order.id];
        } catch(err) {
          console.error("Error removing order :: " + JSON.stringify(err));
        }
      })

      _.forEach(serverOrders, function(order) {
        try {
          if (order.id) {
            if (orders[order.id]) {
              _.assign(orders[order.id], order);
            } else {
              orders[order.id] = order;
            }
          }
        } catch(err) {
          console.error("Error updating order :: " + JSON.stringify(err));
        }
      });
    });

  }

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
    },

    deleteOrder: function(id) {
      vnaSocket.emit("deleteOrder", id);
    },

    startOrderTimer: function(id, seconds) {
      vnaSocket.emit("startOrderTimer", {
        id: id,
        seconds: seconds
      });
    }

  }

}]);