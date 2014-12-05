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

var request = require('request');
var five = require('johnny-five');
var board = new five.Board();

var RIGHT = 8;
var UP = 9;
var DOWN = 10;
var LEFT = 11;
var ACTION = 12;

var URL = 'http://192.168.1.109:8000/update';

board.on('ready', function() {

  function update() {
    request({
      method: 'post',
      json: true,
      url: URL,
      body: {
        up: states[UP],
        down: states[DOWN],
        left: states[LEFT],
        right: states[RIGHT],
        action: states[ACTION]
      }
    });
  }

  var states = {};
  [RIGHT, UP, DOWN, LEFT, ACTION].forEach(function(pin) {
    states[pin] = false;
    var button = new five.Button(pin);
    button.on('press', function() {
      states[pin] = true;
      update();
    });
    button.on('release', function() {
      states[pin] = false;
      update();
    });
  });
});
