var Particle    = require('particle-api-js');
var colors      = require('colors');
var loginInfo   = require('./credentials.json');

// Login to Particle using stored credentials
console.log('Logging into Particle...'.yellow)

var particle = new Particle();
particle.login({
    username: loginInfo.username,
    password: loginInfo.password
}).then(
    function(data) {
        console.log('Login successful.\n'.green)

        // Flash firmware to device using access token from login
        particle.flashDevice({ 
            deviceId: loginInfo.deviceID, 
            files: { file1: 'firmware/particle_photon.ino' }, 
            auth: data.body.access_token 
        }).then(function(data) {
                console.log('Device flashing started successfully.'.green);
            }, function(err) {
                console.log('An error occurred while flashing the device: '.red, err);
            }
        );
    }, function(err) {
        console.log('Could not login to Particle, error: '.red, err);
    }
)
