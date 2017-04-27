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

function getAllByName(name) {
  return fs.readdirSync("config/" + name);
}