var fs = require('fs');

var pizzas, pastas;

module.exports = {

  initialize: function() {
    pizzas = getAllByName("pizzas");
    pastas = getAllByName("pastas");
  },

  getAllPizzas: function() {
    return pizzas;
  },

  getAllPastas: function() {
    return pastas;
  },

  addPizza: function(pizza) {
    if(pizzas.indexOf(pizza) < 0) {
      pizzas.push(pizza);
      addEntry(pizza, "pizzas");
    }
  },

  addPasta: function(pasta) {
    if(pastas.indexOf(pasta) < 0) {
      pastas.push(pasta);
      addEntry(pasta, "pastas");
    }
  }

};

// Execute the init when this module is required
module.exports.initialize();

function addEntry(name, type) { 
  try {
    fs.closeSync(fs.openSync(`config/${type}/${name}`, 'w'));
  } catch(err) {
    console.log(`Failed to create item ${name} in ${type}`);
  }
}

function getAllByName(name) {
  return fs.readdirSync("config/" + name);
}