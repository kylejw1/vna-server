app.controller('MainController', ['vnaSocket', '$document', '$mdSidenav', 'OrderService', '$state', 
    function(vnaSocket, $document, $mdSidenav, OrderService, $state) {

  var vm = this;

  vm.locations = [
    { 
      name: "Front", 
      station: "front",
      typeFilter: null
    },
    { 
      name: "Back Oven", 
      station: "oven",
      typeFilter: null
    },
    { 
      name: "Back Pizza", 
      station: "pizza",
      typeFilter: "pizza"
    },
    { 
      name: "Back Pasta", 
      station: "pasta",
      typeFilter: "pasta"
    }
  ];

  vm.selectedLocation = _.find(vm.locations, { station: $state.params.station });
  vm.title = "Verona Order Queue  -  " + _.capitalize(vm.selectedLocation.name);

  vm.configurations = [
    { name: "Pizza Types" },
    { name: "Pasta Types" }
  ];

  vm.locationClicked = function(location) {
    $state.go('main.menu', {station: location.station, typeFilter: location.typeFilter});
    $mdSidenav('left').close();
  };

  vm.sideNavToggle = function() {
    $mdSidenav('left').toggle();
  };

}]);