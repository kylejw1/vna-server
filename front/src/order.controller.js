app.controller('OrderController', ['vnaSocket', function(vnaSocket) {

  var vm = this;

  vm.types = [
    { name: "Pepperoni" },
    { name: "Hawaiian" },
    { name: "Meat Lovers" },
    { name: "Vegetarian" },
    { name: "Cheese" },
    { name: "BBQ Chicken" },
    { name: "Deluxe" },
    { name: "Bacon" },
    { name: "Pepperoni" },
    { name: "Hawaiian" },
    { name: "Cheese" },
    { name: "Vegetarian" },
    { name: "Deluxe" },
    { name: "BBQ Chicken" },
    { name: "Bacon" },
    { name: "Meat Lovers" },
    { name: "Pepperoni" },
    { name: "Bacon" },
    { name: "Pepperoni" },
    { name: "Hawaiian" },
    { name: "Cheese" },
    { name: "Vegetarian" },
    { name: "Hawaiian" },
    { name: "Meat Lovers" },
    { name: "Vegetarian" },
    { name: "Cheese" },
    { name: "BBQ Chicken" },
    { name: "Deluxe" },
    { name: "Deluxe" },
    { name: "BBQ Chicken" },
    { name: "Bacon" },
    { name: "Meat Lovers" }
  ]

  vm.order = function(type) {
    vm.isFullScreen = !vm.isFullScreen;
    // vm.broadCast = function() {
    //   vnaSocket.emit("order", type);
    // };
  }

}]);