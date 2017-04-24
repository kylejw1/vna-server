var _ = require('lodash');

var orders = [];
var index = 0;

setInterval(cleanup, 60000);
function cleanup() {

  if (orders.length === 0) {
    return;
  }

  console.log(`Running cleanup task on ${orders.length} items`);

  var staleDate = new Date();
  staleDate.setMinutes(staleDate.getMinutes() - 30);

  // Pop anything that is ready for more than 30 min
  _.remove(orders, order => order.readyTime && order.readyTime < staleDate);

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

    orders.push(order);

    return order;
  },

  updateOrder: function(id, params) {
    var order = _.find(orders, { id: id });
    if (!order) {
      console.log("updateOrder :: failed to locate order with ID=" + id);
    }

    return _.assign(order, params);
  }

};