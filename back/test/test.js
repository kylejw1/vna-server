var io = require('socket.io-client');
var _ = require('lodash');
var socket = io.connect('http://vna.duckdns.org');
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmVyb25hIiwiaWF0IjoxNDk0NTU5OTY1fQ.KwxGGR8T_joEshHQSl6qiyVn91GIWEkvf-NalG2DSog";

var orders = {};
var stats = {
  errors: 0,
  totalOrders: 0,
  outstandingOrders: 0,
  deletes: 0
};

socket.on('version', function(version) {
  console.log('received version info: ', version);
});

socket.on('error', function(error) {
  stats.errors += 1;
});

socket.on('orderAdded', function(order) {
  orders[order.id] = order;
  stats.totalOrders += 1;
  stats.outstandingOrders += 1;
});

socket.on('orderRemoved', function(id) {
  stats.outstandingOrders -= 1;
  stats.deletes += 1;
  delete orders[id];
});

setInterval(action, 50, socket);
setInterval(function() {
  console.log("Stats: ", stats);
}, 5000);

function random(max) {
  return Math.floor(Math.random() * max);
}

function action(socket) {
  
  var rand = random(2);

  if (rand == 0 || stats.outstandingOrders > 100) {
    deleteOrder(socket);
  } else {
    createOrder(socket);
  }
}

function createOrder(socket) {
  authEmit('createOrder', {name: "test pizza", type: "pizza"}, socket);
}

function deleteOrder(socket) { 
  var id = _(orders).keys().sample();
  if (id) {
    authEmit('deleteOrder', id, socket);
  }
}

function authEmit(event, data, socket) {
  socket.emit(event, { data: data, token: token });
}