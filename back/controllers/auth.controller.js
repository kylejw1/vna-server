var jwt = require('jsonwebtoken');

var key = process.env.VNA_PRIVATE_KEY || "cef9a423c47c41068d675445fc0a0339";
var password = process.env.VNA_PASS || "imhungry";

module.exports = {

  login: function(req, res) {

    if(!req.body || !req.body.user || !req.body.pass) {
      return res.status(401).send();
    }

    var user = req.body.user || "";
    var pass = req.body.pass || "";

    // Force lowercase because angular onscreen keyboard is auto pressing shift on load
    // and this is a bad ux for a touchscreen
    if (pass.toLowerCase() !== password.toLowerCase()) {
      return res.status(401).send();
    }

    jwt.sign({ name: user }, key, function(err, token) {
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

    jwt.verify(req.cookies.token, key, function(err, decoded) {
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
    jwt.verify(data.token, key, function(err, decoded) {
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