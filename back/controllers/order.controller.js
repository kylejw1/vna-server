var orderService = require('../services/order.service.js');

module.exports = {

  getOrders: function(req, res) {
    res.send(orderService.getOrders());
  }

};