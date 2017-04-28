var express = require('express');
var io = require('socket.io');
var http = require('http');
var serveStatic = require('serve-static');
var dataController = require('./controllers/data.controller.js');
var orderController = require('./controllers/order.controller.js');

var app = express();
var server = http.createServer(app);
var io = io.listen(server);

app.use(serveStatic('../front', { maxAge: 0, setHeaders: setCustomCacheControl }));
app.get('/socket.io/socket.io.js', serveStatic('node_modules/socket.io-client/dist/socket.io.min.js'));
app.post('/api/pizza', dataController.addPizza);
app.post('/api/pasta', dataController.addPasta);
app.get('/api/pizzas', dataController.getAllPizzas);
app.get('/api/pastas', dataController.getAllPastas);
app.get('/api/orders', orderController.getOrders);
app.get('/api/time', orderController.getTime);

io.on('connection', socket => {

  socket.on('message', data => {
    console.log('received message: ', JSON.stringify(data));

    socket.emit('message', {"hello": "clients"});
 
  });

  socket.on('createOrder', data => {
    orderController.createOrder(data, io);
  });

  socket.on('deleteOrder', id => {
    orderController.deleteOrder(id, io);
  });

  socket.on('startOrderTimer', data => {
    orderController.startOrderTimer(data, io);
  });

});

server.listen(1337, () => {
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