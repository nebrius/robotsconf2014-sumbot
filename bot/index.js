#!/usr/bin/env node
/*
The MIT License (MIT)

Copyright (c) 2014 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

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

const express = require('express');
const bodyParser = require('body-parser');
const five = require('johnny-five');
const Raspi = require('raspi-io');
const board = new five.Board({
  repl: false,
  io: new Raspi()
});

const FORWARD = 'forward';
const FORWARD_RIGHT = 'forward_right';
const FORWARD_LEFT = 'forward_left';
const LEFT = 'left';
const RIGHT = 'right';
const BACK = 'back';
const BACK_LEFT = 'back_left';
const BACK_RIGHT = 'back_right';
const NONE = 'none';

const OFF_ANGLE_SPEED = 0;

const LEFT_SERVO = 'GPIO18';
const RIGHT_SERVO = 'GPIO19';

board.on('ready', () => {
  const left = new five.Servo({
    pin: LEFT_SERVO,
    type: 'continuous',
    invert: false
  });
  const right = new five.Servo({
    pin: RIGHT_SERVO,
    type: 'continuous',
    invert: true
  });

  function move(direction) {
    console.log(`Moving to ${direction}`);
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

  const app = express();
  app.use(bodyParser.json());
  app.post('/update', (req, res) => {
    const x = req.body.x;
    const y = req.body.y;
    console.log(x, y);
    if (y > 0) {
      if (x < 0) {
        move('upleft');
      } else if (x > 0) {
        move(FORWARD_RIGHT);
      } else {
        move(FORWARD);
      }
    } else if (y < 0) {
      if (x < 0) {
        move(BACK_LEFT);
      } else if (x > 0) {
        move(BACK_RIGHT);
      } else {
        move(BACK);
      }
    } else if (x > 0) {
      move(RIGHT);
    } else if (x < 0) {
      move(LEFT);
    } else {
      move(NONE);
    }
    res.send('ok');
  });
  const server = app.listen(8000, () => {
    console.log('Server listening on port ' + server.address().port);
  });
});
