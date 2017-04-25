var _ = require('lodash');

var orders = {};
var index = 0;

setInterval(cleanup, 60000);
function cleanup() {

  if (Object.getOwnPropertyNames(orders).length === 0) {
    return;
  }

  console.log(`Running cleanup task on ${orders.length} items`);

  var staleDate = new Date();
  staleDate.setMinutes(staleDate.getMinutes() - 30);

  // Pop anything that is ready for more than 30 min
  orders = _.reject(orders, order => order.readyTime && order.readyTime < staleDate);

  console.log(`Cleanup complete. ${orders.length} items remain`);
}

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
      requestTime: now,
      ovenTime: null,
      readyTime: null
    };

    index += 1;

    orders[order.id] = order;

    return order;
  },

  updateOrder: function(orderData) {
    if (!orderData.id || !orders[orderData.id]) {
      console.log("updateOrder :: failed to locate order with ID=" + id);
    }

    return _.assign(orders[orderData.id], orderData);
  },

  deleteOrder: function(id) {
    delete orders[id];
  }

};