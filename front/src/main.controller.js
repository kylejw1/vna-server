app.controller('MainController', ['vnaSocket', '$document', '$mdSidenav', 'OrderService', 
    function(vnaSocket, $document, $mdSidenav, OrderService) {

  var vm = this;

  vm.orders = OrderService.getOrders();

  vm.locations = [
    { name: "Front" },
    { name: "Back Oven" },
    { name: "Back Pasta" },
    { name: "Back Pizza" }
  ];
  vm.selectedLocation = 1;//_.find(vm.locations, { name: "Front" }).name;

  vm.configurations = [
    { name: "Pizza Types" },
    { name: "Pasta Types" }
  ];

  vm.sideNavToggle = function() {
    $mdSidenav('left').toggle();
  };

}]);