// Load and immediately run tesselate module
var collectPeriod = 1000;
var collectDuration = 10500;

require('tesselate')({
    modules: {
        C: ['accel-mma84', 'ac'], // load accelerometer module, aliased as ‘accel’ on port A
        B: ['sdcard', 'sd'] // load IR module, aliased as ‘ir’ on port B
    },
    development: true // enable development logging, useful for debugging
}, function(tessel, m) {

    var fs;
    m.sd.getFilesystems(function(err, fss) {
        fs = fss[0];
    });

    var xyz;
    m.ac.on('data', function(xyzNew) {
        xyz = xyzNew;
    });

    var data = [];

    var printFileSystem = function() {
        // console.log("printFileSystem");
        if (fs && xyz) {
            console.log('found fs');
            console.log('xyz exists', xyz);
            data.push(xyz);
            if (data.length >= 10) {
                clearInterval(id);
                fs.writeFile('data.txt', data.toString(), function(err) {
                    console.log('Write complete. Reading...');
                });
            }

        }
    };

    var id = setInterval(printFileSystem, 1000);

    // returns your modules to you as properties of object m
    // refer to the IR module as m.ir, or the accelerometer module as m.accel

    //your code here
});
