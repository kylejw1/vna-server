app.controller('StatusController', [ 'OrderService',
    function(OrderService) {

  var vm = this;

  vm.orders = OrderService.getOrders();

}]);