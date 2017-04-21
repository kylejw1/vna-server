var orderService = require('../services/order.service.js');

module.exports = {

  getOrders: function(req, res) {
    res.send(orderService.getOrders());
  },

  createOrder: function(orderData, ioServer) {
    var order = orderService.createOrder(orderData);
    ioServer.sockets.emit("addOrder", order);
  }

};