const Particle = require('particle-api-js');
const loginInfo = require('./credentials.json');

var particle = new Particle();
var accessToken = "";

particle.login({
    username: loginInfo.username,
    password: loginInfo.password,
}).then(
    function(data) {
        accessToken = data.body.access_token;
        console.log('Particle logged in with token: ', data.body.access_token);
    }, function(err) {
        console.log('Could not login to Particle: ', err);
    }
);

var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerPlatform('homebridge-particle-relaymodule', 'RelayModule', RelayModulePlatform);
}

function RelayModulePlatform(log, config, api) {
    if (!config) {
        log.warn('Ignoring RelayModule platform setup because it is not configured');
    } else if (!config['devices']) {
        log.error('"devices" property in platform definition unfilled in config')
    }

    this.log = log;
    this.config = config;
    if (api) {
        this.api = api;

        this.api.on('didFinishLaunching', function() {
            this.log('Cached accessories loaded');
        }.bind(this));
    }

    this.devices = this.config['devices'];
}

RelayModulePlatform.prototype = {
    accessories: function(callback) {
        var parsedAccessories = [];
        for (var i = 0; i < this.devices.length; ++i) {
            var accessory = new RelayModuleAccessory(this.log, this.devices[i]);
            parsedAccessories.push(accessory);
        }
        callback(parsedAccessories);
    }
};

function RelayModuleAccessory(log, accessory) {
    this.log = log;
    this.currentState = false;
    this.services = [];

    // Check for required keys in accessory
    var required_accessory_keys = ['name', 'type', 'relayPin'];
    for (i = 0; i < required_accessory_keys.length; ++i) {
        if (!(required_accessory_keys[i] in accessory)) {
            this.log.warn('Accessory missing key ' + required_accessory_keys[i])
        }
    }

    this.name = accessory['name'];
    this.type = accessory['type'].toUpperCase();
    this.relayPin = accessory['relayPin'];

    this.informationService = new Service.AccessoryInformation();
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, 'Particle')
        .setCharacteristic(Characteristic.Model, 'RelayModule')
        .setCharacteristic(Characteristic.SerialNumber, 'RELAYMODULE');
    this.services.push(this.informationService);

    if (this.type == 'LIGHT') {
        this.actionService = new Service.Lightbulb(this.name);
    } else if (this.type == 'SWITCH') {
        this.actionService = new Service.Switch(this.name);
    } else if (this.type == 'GARAGE') {
        this.actionService = new Service.GarageDoorOpener(this.name);
    }
    this.actionService.getCharacteristic(Characteristic.On)
            .on('get', this.getState.bind(this))
            .on('set', this.setState.bind(this));
    this.services.push(this.actionService);
}

RelayModuleAccessory.prototype = {
    getServices: function() {
        return this.services
    },

    getState: function(callback) {
        this.log('Getting state of "' + this.name + '": ' + this.currentState)
        return callback(null, this.currentState)
    },

    setState: function(value, callback) {
        this.log('Setting state of "' + this.name + '": ' + value)

        if (value) {
            particle.callFunction({
                deviceId: loginInfo.deviceID,
                name: 'turnOn',
                argument: this.relayPin,
                auth: accessToken,
            });
        } else {
            particle.callFunction({
                deviceId: loginInfo.deviceID,
                name: 'turnOff',
                argument: this.relayPin,
                auth: accessToken,
            });
        }
        return callback();
    }
};
