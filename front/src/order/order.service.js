app.service('OrderService', ["$http", "vnaSocket", "$timeout", "$interval", function($http, vnaSocket, $timeout, $interval) {  

  var orders = {};
  var timeLeft = {};

  var timeOffset = 0;

  var syncInterval = $interval(sync, 120000);
  sync();

  var timeLeftInterval = $interval(updateTimeLeft, 1000);

  // Subscribe to pushed orders
  vnaSocket.on("orderAdded", function(order) {
    if (!order.id) {
      console.error("orderAdded :: No id provided");
    }
    orders[order.id] = order;
  });

  vnaSocket.on("orderTimerStarted", function(order) {
    if (!orders[order.id]) {
      console.warn("Received start notification for unknown order :: id=" + order.id);
      orders[order.id] = order;
    } else {
      _.assign(orders[order.id], order);
    }
  });

  vnaSocket.on("orderRemoved", function(id) {
    delete orders[id];
  });

  function getSecondsLeft(startTimeMsec, endTimeMsec) {
    // Get start time corrected for this device
    var localEndTime = timeOffset + endTimeMsec;
    var now = new Date().getTime();

    return Math.max(0, Math.floor((localEndTime - now) / 1000));
  }

  function updateTimeLeft() {
    _.forEach(orders, function(order) {
      if (order.cookStart && order.cookEnd) {
        timeLeft[order.id] = getSecondsLeft(order.cookStart, order.cookEnd);
        console.log("Time left " + order.name + " " + timeLeft[order.id]);
      }
    });
  }

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

  return {

    getOrders: function() {
      return orders;
    },

    getTimeLeft: function() {
      return timeLeft;
    },

    createOrder: function(type, name) {
      var order = {
        name: name,
        type: type
      };

      vnaSocket.emit("createOrder", order);
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