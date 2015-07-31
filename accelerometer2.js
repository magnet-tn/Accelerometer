// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);


    // Stream accelerometer data
var showDataOnConsole = function (xyz) {
    console.log('x:', xyz[0].toFixed(3),
      'y:', xyz[1].toFixed(3),
      'z:', xyz[2].toFixed(3));
};

// Stream accelerometer data
var doThisWhenAccelerometerIsReady = function (){
accel.on('data', showDataOnConsole);
};

// Initialize the accelerometer.
accel.on('ready', doThisWhenAccelerometerIsReady);

accel.on('error', function(err){
  console.log('Error:', err);
});