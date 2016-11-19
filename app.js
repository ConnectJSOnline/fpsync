var awsIot = require('aws-iot-device-sdk');
var moment = require('moment');

exports.Device = {
    ClientID : 2102,
    Name : undefined,
    SubscriptionTopics : [],
    DeviceReady : false,
    PublishTopic : 'register_swipe/log',
    Payload : {
        deviceid: 0,
        direction : undefined,
        empid : undefined,
        timestamp : new moment().format("HH:mm:ss")
    }
}


exports.initPayload = function (Device, cli)
{
    if (cli.indexOf("-e") > -1 && cli.indexOf("-d") > -1) {
        Device.Payload.direction = cli[cli.indexOf("-d") + 1].toUpperCase();
        Device.Payload.empid = cli[cli.indexOf("-e") + 1].toUpperCase();
        Device.Payload.timestamp = new moment().format("HH:mm:ss");
    }
}


exports.Connect = function() {
    console.log("Connecting...");
    var device = awsIot.device({
        "host": "a20jrkqareb4mh.iot.us-west-2.amazonaws.com",
        "port": 8883,
        "clientId": exports.Device.Name + "_" + exports.Device.ClientID,
        "thingName": exports.Device.Name,
        "caCert": "certs/root-CA.crt",
        "clientCert": "certs/90c78d38ea-certificate.pem.crt",
        "privateKey": "certs/90c78d38ea-private.pem.key"
    });

    device.on('connect', function () {
        console.log('Device Connected to IOT');
        exports.Device.DeviceReady = true;
    });
    return device;
};

exports.PullSubscriptions = function (_device) {
    var mysql = require('mysql');
    var pool = mysql.createPool({
        host     : '74.208.80.212',
        user     : 'tbdautomations',
        password : 'Atmega328',
        database : 'hurestic'
    });
    

    console.log("Connecting to Database Server");
    pool.getConnection(function (err, connection) {
        console.log("Connected! Pulling Topics...");
        connection.query('SELECT * from mqtt_subscription where deviceid=' + exports.Device.ClientID, function (err, rows) {
            var interval = setInterval(function () {
                if (exports.Device.DeviceReady) {
                    clearInterval(interval);
                    for (i = 0; i < rows.length; i++) {
                        exports.Device.SubscriptionTopics.push(rows[i].topic_address);
                        _device.subscribe(rows[i].topic_address);
                    }
                }
            }, 10);
            connection.release();
            console.log("Additional Topics Subscribed");
        });
    });
}
