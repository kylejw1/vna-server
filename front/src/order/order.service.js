app.service('OrderService', ["$http", "vnaSocket", "$timeout", "$interval", "$mdToast", 
    function($http, vnaSocket, $timeout, $interval, $mdToast) {  

  var orders = {};

  var timeOffset = 0;

  var syncInterval = $interval(syncTime, 15000);
  syncTime();

  var progressInterval = $interval(updateProgress, 1000);

  vnaSocket.on("connect", function() {
    $mdToast.showSimple("Connected");
    initExistingOrders();
  });

  vnaSocket.on("disconnect", function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent("Connection Lost")
        .hideDelay(0)
    );
  });

  // Subscribe to pushed orders
  vnaSocket.on("orderAdded", function(order) {
    if (!order.id) {
      console.error("orderAdded :: No id provided");
    }
    addOrder(order);
  });

  vnaSocket.on("orderTimerStarted", function(order) {
    if (!orders[order.id]) {
      console.warn("Received start notification for unknown order :: id=" + order.id);
      addOrder(order);
    } else {
      _.assign(orders[order.id], order);
    }
  });

  vnaSocket.on("orderRemoved", function(id) {
    delete orders[id];
  });

  function initExistingOrders() {

    _(orders).keys().forEach(function(key) {
      delete orders[key];
    });

    // Get initial list from server
    $http.get("/api/orders").then(function(data) {
      _.forEach(data.data, addOrder);
    });
  }

  function addOrder(order) {

    var o = {
      id: null,
      name: null,
      type: null,
      secondsLeft: null,
      percentComplete: 0,
      status: "Waiting",
      cookStart: null,
      cookEnd: null
    };

    order = _.assign(o, order);

    orders[order.id] = order;
  }

  function getSecondsLeft(startTimeMsec, endTimeMsec) {
    // Get start time corrected for this device
    var localEndTime = timeOffset + endTimeMsec;
    var now = new Date().getTime();

    return Math.max(0, Math.floor((localEndTime - now) / 1000));
  }

  function updateOrderProgress(order) {
    if (order.cookStart && order.cookEnd) {
      order.secondsLeft = getSecondsLeft(order.cookStart, order.cookEnd);
      order.percentComplete = 100 * (order.cookDuration - order.secondsLeft) / order.cookDuration;
      order.status = order.secondsLeft === 0 ? "Complete" : "Cooking"; 
    } 
  }

  function updateProgress() {
    _.forEach(orders, function(order) {
      updateOrderProgress(order);
    });
  }

  function syncTime() {

    // Update time offset (in case this device cannot reach a timeserver)
    $http.get("/api/time").then(function(data) {
      var now = new Date().getTime();
      timeOffset = now - parseInt(data.data); 
      console.log("Synced time offset (msec) :: " + timeOffset);
    }).catch(function(err) {
      console.error("Failed to sync time :: " + JSON.stringify(err));
    });

  }

  return {

    getOrders: function() {
      return orders;
    },

    createOrder: function(type, name) {
      var order = {
        name: name,
        type: type
      };

      vnaSocket.emitWithToken("createOrder", order);
    },

    deleteOrder: function(id) {
      vnaSocket.emitWithToken("deleteOrder", id);
    },

    startOrderTimer: function(id, seconds) {
      vnaSocket.emitWithToken("startOrderTimer", {
        id: id,
        seconds: seconds
      });
    }

  }

}]);