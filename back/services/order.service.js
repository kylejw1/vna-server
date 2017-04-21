
var orders = [];

module.exports = {

  getOrders: function() {
    return orders;
  },

  createOrder: function(orderData) {

    var order = {
      id: new Date().getTime(),
      type: orderData.type,
      name: orderData.name,
    }

    orders.push(order);

    return order;
  }

};