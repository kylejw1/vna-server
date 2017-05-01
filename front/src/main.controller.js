app.controller('MainController', ['vnaSocket', '$document', '$mdSidenav', 'OrderService', '$state', 
    function(vnaSocket, $document, $mdSidenav, OrderService, $state) {

  var vm = this;

  vm.columns = parseInt($state.params.columns) || 2;

  vm.layoutToggle = function() {
    params = _.clone($state.params);
    params.columns = params.columns === 1 ? 2 : 1;
    $state.go($state.current.name, params);
  };

  vm.locations = [
    { 
      name: "Front", 
      station: "front",
      typeFilter: null,
      layout: "twoColumnLayout"
    },
    { 
      name: "Back Oven", 
      station: "oven",
      typeFilter: null,
      layout: "twoColumnLayout"
    },
    { 
      name: "Back Pizza", 
      station: "pizza",
      typeFilter: "pizza",
      layout: "oneColumnLayout"
    },
    { 
      name: "Back Pasta", 
      station: "pasta",
      typeFilter: "pasta",
      layout: "twoColumnLayout"
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
      layout: location.layout
    });
    $mdSidenav('left').close();
  };

  vm.sideNavToggle = function() {
    $mdSidenav('left').toggle();
  };

}]);