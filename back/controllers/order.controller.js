var orderService = require('../services/order.service.js');

module.exports = {

  getOrders: function(req, res) {
    res.send(orderService.getOrders());
  },

  createOrder: function(orderData, ioServer) {
    var order = orderService.createOrder(orderData);
    ioServer.sockets.emit("orderAdded", order);
  },

  updateOrder: function(id, params, ioServer) {
    var order = orderService.updateOrder(id, params);
    ioServer.sockets.emit("orderUpdated", order);
  }

};