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

'use strict';

const request = require('request');
const five = require('johnny-five');
const board = new five.Board({
  repl: false
});

const RIGHT = 4; // brown
const UP = 5;    // white
const DOWN = 6;  // blue
const LEFT = 7;  // green
const ACTION = 12;

const URL = 'http://192.168.1.4:8000/update';

board.on('ready', () => {
  const states = {};

  function update() {
    let x, y;
    if (states[UP]) {
      if (states[LEFT]) {
        x = -0.707;
        y = 0.707;
      } else if (states[RIGHT]) {
        x = 0.707;
        y = 0.707;
      } else {
        x = 0;
        y = 1;
      }
    } else if (states[DOWN]) {
      if (states[LEFT]) {
        x = -0.707;
        y = -0.707;
      } else if (states[RIGHT]) {
        x = 0.707;
        y = -0.707;
      } else {
        x = 0;
        y = -1;
      }
    } else if (states[LEFT]) {
      x = -1;
      y = 0;
    } else if (states[RIGHT]) {
      x = 1;
      y = 0;
    } else {
      x = 0;
      y = 0;
    }
    console.log(`Sending joystick position (${x},${y})`);
    request({
      method: 'post',
      json: true,
      url: URL,
      body: { x, y }
    });
  }

  [RIGHT, UP, DOWN, LEFT, ACTION].forEach((pin) => {
    states[pin] = false;
    const button = new five.Button(pin);
    setInterval(update, 100);
    button.on('press', () => {
      states[pin] = true;
    });
    button.on('release', () => {
      states[pin] = false;
    });
  });
});
