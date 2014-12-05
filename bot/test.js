var five = require("johnny-five"),
    // or "./lib/johnny-five" when running from the source
    board = new five.Board();

board.on("ready", function() {

  var left = new five.Servo({
    pin: 3,
    type: 'continuous'
  });

  var right = new five.Servo({
    pin: 5,
    type: 'continuous'
  });

  left.ccw(1);
  right.cw(1);
  console.log('running');

});
