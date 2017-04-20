var dataService = require("../services/data.service.js");

module.exports = {

  getAllPizzas: function(req, res) {
    return res.send(dataService.getAllPizzas());
  },

  getAllPastas: function(req, res) {
    return res.send(dataService.getAllPastas());
  },

  addPizza: function(req, res) {

    var name = req.query.name;

    if (!name) {
      return res.status(400).send("Missing parameter 'name'");
    }

    try {
      dataService.addPizza(name);
      return res.send("Added " + name);
    } catch(err) {
      return res.status(500).send(err)
    }
  },

  addPasta: function(req, res) {

    var name = req.query.name;

    if (!name) {
      return res.status(400).send("Missing parameter 'name'");
    }

    try {
      dataService.addPasta(name);
      return res.send("Added " + name);
    } catch(err) {
      return res.status(500).send(err)
    }
  }

};