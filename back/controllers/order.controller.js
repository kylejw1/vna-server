var orderService = require('../services/order.service.js');

module.exports = {

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
  }

};