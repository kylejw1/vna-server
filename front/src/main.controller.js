app.controller('MainController', ['vnaSocket', '$document', function(vnaSocket, $document) {

  var vm = this;

  vm.locations = [
    { name: "Front" },
    { name: "Back Oven" },
    { name: "Back Pasta" },
    { name: "Back Pizza" }
  ];
  vm.selectedLocation = _.find(vm.locations, { name: "Front" }).name;

  vm.fullscreenIcon = getFullscreenToggleIcon();
  vm.toggleFullscreen = function() {
    if (isFullscreen()) {
      requestExitFullscreen();
      vm.fullscreenIcon = "fullscreen_exit";
    } else {
      requestFullScreen();
      vm.fullscreenIcon = "fullscreen";
    }
  };


  vm.setChannel = function(channel) {
    console.log("Setting channel " + channel);
    vm.broadCast();
  };

  vm.broadCast = function() {
    vnaSocket.emit("message", "hello server");
  };

  vnaSocket.on('message', function(data) {
    console.log("Received message: " + JSON.stringify(data));
  });

  function getFullscreenToggleIcon() {
    return isFullscreen() ? "fullscreen_exit" : "fullscreen";
  } 

  function isFullscreen() {
    var document = $document[0].documentElement;

    if (!document) {
      return false;
    }

    return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
  }

  function requestFullScreen() {
    var document = $document[0].documentElement;
    var requestFtn = document.requestFullscreen || document.msRequestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen;
    requestFtn();
  }

  function requestExitFullscreen() {
    var document = $document[0].documentElement;
    var requestFtn = document.exitFullscreen || document.msCancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen;
    requestFtn();
  }


}]);