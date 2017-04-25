var orderService = require('../services/order.service.js');

module.exports = {

  getTime: function(req, res) {
    return res.send(`${new Date().getTime()}`);
  },

  getOrders: function(req, res) {
    res.send(orderService.getOrders());
  },

  createOrder: function(orderData, ioServer) {
    var order = orderService.createOrder(orderData);
    ioServer.sockets.emit("orderAdded", order);
  },

  updateOrder: function(orderData, ioServer) {
    if (!orderData.id) {
      console.error("updateOrder :: No order ID provided");
      return;
    }
    var order = orderService.updateOrder(orderData);
    ioServer.sockets.emit("orderUpdated", order);
  },

  deleteOrder: function(id, ioServer) {
    orderService.deleteOrder(id);
    ioServer.sockets.emit("orderRemoved", id);
  },

  startOrderTimer: function(data, ioServer) {
    var order = orderService.startOrderTimer(data.id, data.seconds);
    if (order) {
      ioServer.sockets.emit("orderTimerStarted", order);
    }
  }

};