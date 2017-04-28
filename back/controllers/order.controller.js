var orderService = require('../services/order.service.js');

module.exports = {

  getTime: function(req, res) {
    return res.send(`${new Date().getTime()}`);
  },

  getOrders: function(req, res) {
    res.send(orderService.getOrders());
  },

  createOrder: function(orderData, ioServer) {
    try {
      var order = orderService.createOrder(orderData);
      ioServer.sockets.emit("orderAdded", order);
    } catch(error) {
      var errString = "createOrder :: " + error;
      console.error(errString);
      ioServer.sockets.emit("error", errString);
    }
  },

  deleteOrder: function(id, ioServer) {
    try {
      orderService.deleteOrder(id);
      ioServer.sockets.emit("orderRemoved", id);
    } catch(error) {
      var errString = "deleteOrder :: " + error;
      console.error(errString);
      ioServer.sockets.emit("error", errString);
    }
  },

  startOrderTimer: function(data, ioServer) {
    try {
      var order = orderService.startOrderTimer(data.id, data.seconds);
      ioServer.sockets.emit("orderTimerStarted", order);
    } catch(error) {
      var errString = "startOrderTimer :: " + error;
      console.error(errString);
      ioServer.sockets.emit("error", errString);
    }
  }

};