var dataService = require("../services/data.service.js");

var io = null;

module.exports = {

  setIo: function(ioServer) {
    io = ioServer;
  },

  getAllPizzas: function(req, res) {
    return res.send(dataService.getAllPizzas());
  },

  getAllPastas: function(req, res) {
    return res.send(dataService.getAllPastas());
  }, 

  deleteItem: function(req, res) {
    try {
      dataService.deleteItem(req.params.name, req.params.type);
      io.sockets.emit("itemRemoved", {type: req.params.type, name: req.params.name});
      res.status(202).send();
    } catch(error) {
      var errString = "deleteItem :: " + error;
      console.error(errString);
      io.sockets.emit("vnaError", errString);
      return res.status(500).send(error);
    }
  },

  addPizza: function(req, res) {

    // TODO: Notify clients

    var name = req.query.name;

    if (!name) {
      return res.status(400).send("Missing parameter 'name'");
    }

    try {
      dataService.addPizza(name);
      io.sockets.emit("itemAdded", {type: "pizza", name: name});
      return res.send("Added " + name);
    } catch(error) {
      var errString = "addPizza :: " + error;
      console.error(errString);
      ioServer.sockets.emit("vnaError", errString);
      return res.status(500).send(error)
    }
  },

  addPasta: function(req, res) {

    // TODO: Notify clients

    var name = req.query.name;

    if (!name) {
      return res.status(400).send("Missing parameter 'name'");
    }

    try {
      dataService.addPasta(name);
      io.sockets.emit("itemAdded", {type: "pasta", name: name});
      return res.send("Added " + name);
    } catch(error) {
      var errString = "addPasta :: " + error;
      console.error(errString);
      ioServer.sockets.emit("vnaError", errString);
      return res.status(500).send(error)
    }
  }

};