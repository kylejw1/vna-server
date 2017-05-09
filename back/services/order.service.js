var _ = require('lodash');
var DataService = require('./data.service.js');

var orders = {};
var index = 0;

module.exports = {

  getOrders: function() {
    return orders;
  },

  createOrder: function(orderData) {

    var now = new Date().getTime();

    var order = {
      id: `${now}${index}`,
      type: orderData.type,
      name: orderData.name,
      added: now,
      secondsLeft: DataService.getDefaultCookTimeSeconds(orderData.type)
    };

    index += 1;

    orders[order.id] = order;

    console.log(`Created order ${order.type}: ${order.name}`);

    return order;
  },

  deleteOrder: function(id) {
    delete orders[id];

    console.log(`Deleted order ID ${id}`);
  },

  startOrderTimer: function(id, seconds) {
    var order = orders[id];
    if (order) {
      order.cookStart = new Date().getTime();
      order.cookEnd = order.cookStart + (seconds*1000);
      order.cookDuration = seconds;

      console.log(`Started cook timer ${order.id}:${order.name} for ${order.cookDuration} seconds`);
    }

    return order;
  }

};