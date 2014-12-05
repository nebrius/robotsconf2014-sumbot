/*
The MIT License (MIT)

Copyright (c) 2013-2014 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var express = require('express');
var bodyParser = require('body-parser');
var five = require('johnny-five');
var board = new five.Board({
  repl: false
});

var FORWARD = 'forward';
var FORWARD_RIGHT = 'forward_right';
var FORWARD_LEFT = 'forward_left';
var LEFT = 'left';
var RIGHT = 'right';
var BACK = 'back';
var BACK_LEFT = 'back_left';
var BACK_RIGHT = 'back_right';
var NONE = 'none';

var OFF_ANGLE_SPEED = 0;

board.on('ready', function() {

  var left = new five.Servo({
    pin: 3,
    type: 'continuous',
    isInverted: false
  });
  var right = new five.Servo({
    pin: 5,
    type: 'continuous',
    isInverted: true
  });

  function move(direction) {
    switch(direction) {
      case FORWARD:
        left.cw(1);
        right.cw(1);
        break;
      case FORWARD_RIGHT:
        left.cw(1);
        right.cw(OFF_ANGLE_SPEED);
        break;
      case FORWARD_LEFT:
        left.cw(OFF_ANGLE_SPEED);
        right.cw(1);
        break;
      case LEFT:
        left.ccw(1);
        right.cw(1);
        break;
      case RIGHT:
        left.cw(1);
        right.ccw(1);
        break;
      case BACK:
        left.ccw(1);
        right.ccw(1);
        break;
      case BACK_LEFT:
        left.ccw(1);
        right.ccw(OFF_ANGLE_SPEED);
        break;
      case BACK_RIGHT:
        left.ccw(OFF_ANGLE_SPEED);
        right.ccw(1);
        break;
      case NONE:
        left.cw(0);
        right.cw(0);
        break;
    }
  }
  move(NONE);

  var app = express();
  app.use(bodyParser.json());
  app.post('/update', function(req, res) {
    var status = req.body;
    console.log(status);
    if (status.up) {
      if (status.left) {
        move(FORWARD_LEFT);
      } else if (status.right) {
        move(FORWARD_RIGHT);
      } else {
        move(FORWARD);
      }
    } else if (status.down) {
      if (status.left) {
        move(BACK_LEFT);
      } else if (status.right) {
        move(BACK_RIGHT);
      } else {
        move(BACK);
      }
    } else if (status.right) {
      move(RIGHT);
    } else if (status.left) {
      move(LEFT);
    } else {
      move(NONE);
    }
    res.send('ok');
  });
  var server = app.listen(8000, function() {
    console.log('Server listening on port ' + server.address().port);
  });
});