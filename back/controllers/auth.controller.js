var fs = require('fs');
var jwt = require('jsonwebtoken');
var guid = require('guid');

const SECRET_ROOT = "secret";
const AUTH_KEY_PATH = SECRET_ROOT + "/auth.key";
const AUTH_PASSWORD_PATH = SECRET_ROOT + "/auth.pass";

if (!fs.existsSync(SECRET_ROOT)) {
  fs.mkdirSync(SECRET_ROOT);
}

var AUTH_KEY = readSecret(AUTH_KEY_PATH);
if (!AUTH_KEY) {
  AUTH_KEY = saveSecret(AUTH_KEY_PATH, guid.raw());
}

var AUTH_PASSWORD = readSecret(AUTH_PASSWORD_PATH);
if (!AUTH_PASSWORD) {
  AUTH_PASSWORD = saveSecret(AUTH_PASSWORD_PATH, 'imhungry');
}

function readSecret(path) {
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (err) {
    console.log(`Secret ${path} could not be read.  Will attempt to generate.  :: ${err}`);
    return null;
  }
}

function saveSecret(path, secret) {
  try {
    fs.writeFileSync(path, secret);
  } catch(err) {
    console.log(`Secret ${path} could not be written.  Will attempt to generate.  :: ${err}`);
  }
  return secret;
}

module.exports = {

  login: function(req, res) {

    if(!req.body || !req.body.user || !req.body.pass) {
      return res.status(401).send();
    }

    var user = req.body.user || "";
    var pass = req.body.pass || "";

    // Force lowercase because angular onscreen keyboard is auto pressing shift on load
    // and this is a bad ux for a touchscreen
    if (pass.toLowerCase() !== AUTH_PASSWORD.toLowerCase()) {
      return res.status(401).send();
    }

    jwt.sign({ name: user }, AUTH_KEY, function(err, token) {
      if (err) {
        return res.status(500).send("Failed to sign cookie");
      } else {
        var longTime = new Date();
        longTime.setFullYear(2099);
        return res.cookie('token', token, { expires: longTime }).send();
      }
    });

  },

  logout: function(req, res) {
    res.clearCookie('token', "").send();
  },

  middleware: function(req, res, next) {

    if (!req.cookies || !req.cookies.token) {
      return res.status(401).send();
    }

    jwt.verify(req.cookies.token, AUTH_KEY, function(err, decoded) {
      if (err) {
        return res.status(401).send();
      } else {
        req.user = decoded.name;
        return next();
      }
    });
  },

  getUser: function(req, res) {
    return res.send(req.user);
  },

  socketIoMiddleware: function(io, socket, data, next) {
    jwt.verify(data.token, AUTH_KEY, function(err, decoded) {
      if (err) {
        console.warn("Socket message from unauthorized user");
        return socket.emit('authError', "Not authorized");
      } else {
        data.user = decoded.name;
        return next(data.data, io);
      }
    });
  }

};