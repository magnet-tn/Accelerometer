// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/


var tessel = require('tessel');
var sd = require('sdcard');
// var sdcard = sdcardlib.use(tessel.port['B']);
var ac = require('accel-mma84').use(tessel.port['A']);

var gLED = tessel.led[0].output(0);
var bLED = tessel.led[1].output(0);
var rLED = tessel.led[2].output(0);
var yLED = tessel.led[3];

var collectPeriod = 1000;
var collectDuration = 10500;
var accelData = '';

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

var index = 0;

//ACCELEROME TER Acquisition Section
// Initialize the accelerometer.
function doThisWhenAccelerometerIsReady() {
    var intId = setInterval(collectData, collectPeriod);
    var timeoutID = setTimeout(stopCollection, collectDuration);

    function collectData() {
        gLED.toggle();
        ac.on('data', function(xyz) {
            // console.log('x:', xyz[0].toFixed(2),
            //     'y:', xyz[1].toFixed(2),
            //     'z:', xyz[2].toFixed(2));
            accelData += index + ', ';
            accelData += xyz[0].toFixed(2) + ', ';
            accelData += xyz[1].toFixed(2) + ', ';
            accelData += xyz[2].toFixed(2) + '\n';
        });
        index += 1;
    }

    function stopCollection() {
        clearInterval(intId);
        console.log(accelData);
        saveData();
        yLED.toggle();
        // clearTimeout(timeoutID);
    }
};

// accel.on('ready', doThisWhenAccelerometerIsReady);

ac.on('error', function(err) {
    console.log('Error:', err);
});


//SDCARD Write= Section
function writeWhatYouSee(accel_file, gvalues) {
    //console.log("Beginning to write", gvalues);
    bLED.toggle();
    var fs;

    function whenImDoneReading(err, data) {
        //console.log('Read:\n', data.toString());
    };

    function whenImDoneWriting(err) {
        rLED.toggle();
        console.log(err);
        //console.log('Write complete.');
        //fs.readFile(accel_file, whenImDoneReading);
    };

    function whenIHaveFileSystemsDo(err, fss) {
        fs = fss[0];
        //console.log('Writing...');
        rLED.toggle();
        fs.writeFile(accel_file, gvalues, whenImDoneWriting);
    };

    function whatToDoWhenTheSDCardIsReady() {
        sd.getFilesystems(whenIHaveFileSystemsDo);
    };

    whatToDoWhenTheSDCardIsReady();
    // tessel.led[0].output(0);
    // tessel.led[1].output(0);
    // tessel.led[2].output(0);
};

function saveData() {
    writeWhatYouSee('Accel_Values.txt', accelData);
    bLED.toggle();
};
