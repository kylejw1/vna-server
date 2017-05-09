var fs = require('fs');
var _ = require('lodash');

var types = {};

module.exports = {

  initialize: function() {
    types.pizza = getAllByType("pizza");
    types.pasta = getAllByType("pasta");
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

    var path = `types/${type}/${name}`;

    if (fs.existsSync(path)) {
      return;
    }

    fs.open(path, 'w', (err, fd) => {
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
  var path = `types/${type}/${name}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

function getAllByType(type) {

  var root = "types/";

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  if (!fs.existsSync(root + type)) {
    fs.mkdirSync(root + type);
  }

  var types = fs.readdirSync(root + type);

  if (types.length === 0) {
    types = createDefaults(type);
  }

  return types;
}

function defaultPizzas() {
  return [
    "4 Cheese",
    "All Meat",
    "BBQ Chicken",
    "Beef and Mushroom",
    "Deluxe",
    "Double Pepperoni",
    "Hawaiian",
    "Pepperoni and Bacon",
    "Pepperoni and Ham",
    "Pepperoni and Mushroom",
    "Pepperoni Mushroom Green Peppers",
    "Spinach and Feta",
    "Spolumbos",
    "Vegetarian",
    "VERONA Special"
  ]
}

function defaultPastas() {
  return [
    "Baked Lasagna",
    "Baked Lasagna with Meatballs",
    "Baked Ravioli",
    "Baked Ravioli with Meatballs",
    "Baked Spaghetti",
    "Baked Spaghetti with Meatballs"
  ]
}

function createDefaults(type) {

  var defaults;

  console.log("Initializing item type " + type);

  switch(type) {
    case "pizza":
    defaults = defaultPizzas();
    break;
    case "pasta":
    defaults = defaultPastas();
    break;
    default: 
    defaults = [];
    break;
  }

  _.forEach(defaults, function(name) {
    addEntry(name, type);
  }); 

  return defaults;
}