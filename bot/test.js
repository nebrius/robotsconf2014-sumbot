var core = require('raspi-core');
var ip = require('./ip.js');

core.init(function() {
  ip();
});