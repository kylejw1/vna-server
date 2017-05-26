var express = require('express');
var io = require('socket.io');
var http = require('http');
var serveStatic = require('serve-static');
var dataController = require('./controllers/data.controller.js');
var orderController = require('./controllers/order.controller.js');
var git = require('git-rev-sync');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authController = require('./controllers/auth.controller.js');

var app = express();
var server = http.createServer(app);
var io = io.listen(server);


var version = `${git.branch()}:${git.short()}`;

dataController.setIo(io);

app.use(serveStatic('../front', { maxAge: 0, setHeaders: setCustomCacheControl }));

app.use(cookieParser());
app.use(bodyParser.json())

app.post('/api/auth/login', authController.login);
app.get('/socket.io/socket.io.js', serveStatic('node_modules/socket.io-client/dist/socket.io.min.js'));
app.get('/api/pizza', dataController.getAllPizzas);
app.get('/api/pasta', dataController.getAllPastas);
app.get('/api/config/version', function(req, res) { res.send(version) });
app.get('/api/orders', orderController.getOrders);
app.get('/api/time', orderController.getTime);
app.get('/api/auth/logout', authController.logout);
app.post('/api/auth/logout', authController.logout);

app.use(authController.middleware);

app.get('/api/auth/user', authController.getUser);

app.put('/api/pizza', dataController.addPizza);
app.put('/api/pasta', dataController.addPasta);
app.delete('/api/data/:type/:name', dataController.deleteItem);

app.post('/api/config/restart', function() { process.exit() });


io.on('connection', socket => {

  socket.authOn = function(event, callback) {
    socket.on(event, data => {
      authController.socketIoMiddleware(io, socket, data, callback);
    });
  };

  // Let the clients know the current version in case they need to reload
  socket.emit('version', {
    version: version,
    uptime: process.uptime()
  });

  socket.authOn('createOrder', orderController.createOrder);

  socket.authOn('deleteOrder', orderController.deleteOrder);

  socket.authOn('startOrderTimer', orderController.startOrderTimer);

});

server.listen(80, () => {
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