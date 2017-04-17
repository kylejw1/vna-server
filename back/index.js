var express = require('express');
var serveStatic = require('serve-static');
var app = express();

app.use(serveStatic('../front', { maxAge: 0, setHeaders: setCustomCacheControl }));

var server = app.listen(1337, () => {
    console.log("App listening");
});
process.on('SIGINT', function() {
  console.log('Shutting down');
  server.close();
  process.exit();
});

function setCustomCacheControl (res, path) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
}