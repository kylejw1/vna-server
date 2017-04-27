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

    var groups = _.groupBy(items, 'status');
    var sorted = [];

    // Complete at the top
    _(groups["Complete"])
      .sortBy("added", "asc")
      .forEach(function(order) { sorted.push(order); }
      );

    // Cooking sorted by time left, ascending
    _(groups["Cooking"])
      .sortBy("secondsLeft", "asc") 
      .forEach(function(order) { sorted.push(order); }
      );

    // Waiting sorted by time added (order.added) asc
    _(groups["Waiting"])
      .sortBy("added", "asc") 
      .forEach(function(order) { sorted.push(order); }
      );

    return sorted;
  };
});
