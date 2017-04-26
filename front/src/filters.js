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

app.filter('orderStatus', function() {
  return function(items) {

    var array = _.values(items);

    array = _.sortBy(array, function(elm) {
      var rank = {
        Complete: 1,
        Cooking: 2,
        Waiting: 3,
        Unknown: 99
      };
      var status = elm.status || "Unknown";
      return rank[status];
    }, function(elm) {
      return elm.secondsLeft;
    });

    return array;
  };
});
