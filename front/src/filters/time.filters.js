Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

app.filter('secondsToDateTime', [function() {
  return function(totalSeconds) {
    var seconds = totalSeconds % 60;
    var minutes = Math.floor(totalSeconds/60);

    return minutes.pad(2) + ":" + seconds.pad(2); 
  };
}]);