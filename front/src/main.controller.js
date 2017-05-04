app.controller('MainController', ['vnaSocket', '$document', '$mdSidenav', 'OrderService', '$state', 
    function(vnaSocket, $document, $mdSidenav, OrderService, $state) {

  var vm = this;

  vm.columns = parseInt($state.params.columns) || 2;

  vm.layoutToggle = function() {
    params = _.clone($state.params);
    params.columns = vm.columns === 1 ? 2 : 1;
    $state.go($state.current.name, params, { reload: true });
  };

  vm.locations = [
    { 
      name: "Front", 
      typeFilter: null,
      columns: 2,
      mode: 'order'
    },
    { 
      name: "Back Oven", 
      typeFilter: null,
      columns: 2,
      mode: 'order'
    },
    { 
      name: "Back Pizza", 
      typeFilter: "pizza",
      columns: 1,
      mode: 'order'
    },
    { 
      name: "Back Pasta", 
      typeFilter: "pasta",
      columns: 2,
      mode: 'order'
    },
    { 
      name: "Pizza Types",
      typeFilter: "pizza",
      columns: 2,
      mode: "edit"
    },
    { 
      name: "Pasta Types",
      typeFilter: "pasta",
      columns: 2,
      mode: "edit"
    }
  ];

  vm.selectedLocation = _.find(vm.locations, { name: $state.params.name || "Front" });
  vm.state = $state;

  vm.locationClicked = function(location) {
    vm.selectedLocation = location; 
    $state.go('main.menu', {
      name: location.name, 
      typeFilter: location.typeFilter,
      columns: location.columns,
      mode: location.mode
    },{
      reload: true
    });
    $mdSidenav('left').close();
  };

  vm.sideNavToggle = function() {
    $mdSidenav('left').toggle();
  };

}]);