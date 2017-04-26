var _ = require('lodash');

var orders = {};
var index = 0;

setInterval(cleanup, 60000);
function cleanup() {

  if (Object.getOwnPropertyNames(orders).length === 0) {
    return;
  }

  console.log(`Running cleanup task on ${orders.length} items`);

  var staleDate = new Date().getTime() - (30*60*1000);

  // Pop anything that is ready for more than 30 min
  orders = _.reject(orders, order => order.cookEnd && order.cookEnd < staleDate);

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