app.controller('MainController', ['vnaSocket', '$document', '$mdSidenav', 'OrderService', '$state', 
    function(vnaSocket, $document, $mdSidenav, OrderService, $state) {

  var vm = this;

  vm.size = {
    left: $state.params.leftFlex || 80,
    middle: $state.params.middleFlex || 20,
    right: $state.params.rightFlex || 0
  }

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
      typeFilter: "pizza",
      hideLeftPane: true
    },
    { 
      name: "Back Pasta", 
      station: "pasta",
      typeFilter: "pasta"
    }
  ];

  vm.selectedLocation = _.find(vm.locations, { station: $state.params.station });
  vm.state = $state;

  vm.configurations = [
    { name: "Pizza Types" },
    { name: "Pasta Types" }
  ];

  vm.locationClicked = function(location) {
    vm.selectedLocation = location; 
    $state.go('main.menu', {
      station: location.station, 
      typeFilter: location.typeFilter,
      hideLeftPane: location.hideLeftPane
    });
    $mdSidenav('left').close();
  };

  vm.sideNavToggle = function() {
    $mdSidenav('left').toggle();
  };

}]);