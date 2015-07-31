// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var ac = require('accel-mma84').use(tessel.port['A']);
var sd = require('sdcard').use(tessel.port['B']);;

var gLED = tessel.led[0].output(0);
var bLED = tessel.led[1].output(0);
var rLED = tessel.led[2].output(0);

var collectPeriod = 500;
var collectDuration = 25000;
var accelData = '';

var fs;

require('tesselate')({
    modules: {
        A: ['accel-mma84', 'ac'],
        B: ['sdcard', 'sd']
    }
}, function(tessel, modules) {
    sd = modules.sd;
    ac = modules.ac;
    doThisWhenAccelerometerIsReady();
});

ac.on('error', function(err) {
    console.log('Error:', err);
});

function doThisWhenAccelerometerIsReady() {
    var intId = setInterval(collectData, collectPeriod);
    var timeoutID = setTimeout(stopCollection, collectDuration);

    function collectData() {
        gLED.toggle();
        ac.getAcceleration(function(err, xyz) {
            if (err !== undefined) {
                console.log('error:' + err);
            }
            accelData += xyz[0].toFixed(2) + ', ';
            accelData += xyz[1].toFixed(2) + ', ';
            accelData += xyz[2].toFixed(2) + '\n';
        });
    }

    function stopCollection() {
        clearInterval(intId);
        console.log(accelData);
        saveData('Accel_Values.txt', accelData);
        gLED.toggle();
    }
}

//SDCARD Write= Section
function saveData(accel_file, gvalues) {
    //console.log("Beginning to write", gvalues);

    var whenImDoneReading = function(err, data) {
        //console.log('Read:\n', data);
    };

    function whenImDoneWriting(err) {
        bLED.toggle();
        //console.log('Write complete.');
        //fs.readFile(accel_file, whenImDoneReading);
    };

    function whenIHaveFileSystemsDo(err, fss) {
        fs = fss[0];
        //console.log('Writing...');
        rLED.toggle();
        fs.writeFile(accel_file, gvalues, whenImDoneWriting);
    };

    sd.getFilesystems(whenIHaveFileSystemsDo);
};
