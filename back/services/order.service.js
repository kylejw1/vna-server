

var orders = [];

module.exports = {

  getOrders: function() {
    return orders;
  },

  createOrder: function(order, io) {

    var order = {
      id: new Date().getTime(),
      type: order.type,
      name: order.name,
    }

    orders.push(order);

    io.sockets.emit("addOrder", order);
  }

};