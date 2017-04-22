app.controller('StatusController', [ 'OrderService',
    function(OrderService) {

  var vm = this;

  // Get the orders reference.  This collection is updated in real time by the socket
  vm.orders = OrderService.getOrders();

}]);