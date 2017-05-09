var fs = require('fs');
var _ = require('lodash');

var types = {};

module.exports = {

  initialize: function() {
    types.pizza = getAllByName("pizza");
    types.pasta = getAllByName("pasta");
  },

  getAllPizzas: function() {
    return types.pizza;
  },

  getAllPastas: function() {
    return types.pasta;
  },

  deleteItem: function(name, type) {
    _.remove(types[type], function(n) {
      return name === n; 
    });
    removeEntry(name, type);
  },

  addPizza: function(pizza) {
    if(types.pizza.indexOf(pizza) < 0) {
      types.pizza.push(pizza);
      addEntry(pizza, "pizza");
    }
  },

  addPasta: function(pasta) {
    if(types.pasta.indexOf(pasta) < 0) {
      types.pasta.push(pasta);
      addEntry(pasta, "pasta");
    }
  },

  getDefaultCookTimeSeconds: function(type) {
    switch(type.toLowerCase()) {
      case "pizza": 
        return 450;
      case "pasta":
        return 330;
      default: 
        return 0;
    }
  }

};

// Execute the init when this module is required
module.exports.initialize();

function addEntry(name, type) { 
  try {
    fs.open(`config/${type}/${name}`, 'w', (err, fd) => {
      if (err) throw err;

      fs.close(fd, (err) => {
        if (err) throw err;

        console.log(`Created item ${name} in ${type}`);
      });

    });
  } catch(err) {
    console.log(`Failed to create item ${name} in ${type}`);
  }
}

function removeEntry(name, type) {
  var path = `config/${type}/${name}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

function getAllByName(name) {
  return fs.readdirSync("config/" + name);
}