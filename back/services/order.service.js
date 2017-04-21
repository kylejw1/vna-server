var _ = require('lodash');

var orders = [];

setInterval(cleanup, 60000);
function cleanup() {

  console.log(`Running cleanup task on ${orders.length} items`);

  var staleDate = new Date();
  staleDate.setSeconds(staleDate.getSeconds() - 60);

  _.remove(orders, order => order.completeTime < staleDate);

  console.log(`Cleanup complete. ${orders.length} items remain`);
}

module.exports = {

  getOrders: function() {
    return orders;
  },

  createOrder: function(orderData) {

    var in2Minutes = new Date();
    in2Minutes.setMinutes(in2Minutes.getMinutes() + 2);

    var order = {
      id: new Date().getTime(),
      type: orderData.type,
      name: orderData.name,
      completeTime: in2Minutes
    }

    orders.push(order);

    return order;
  }

};