var thing = require('./app.js');

var cli = process.argv;
var Device = thing.Device;

Device.ClientID = 2034;
Device.Name = "TBDAutomations_Location_Mumbai";
Device.PublishTopic = "register_swipe/log";
Device.Payload.deviceid = Device.ClientID;
Device.Payload.direction = "out";
Device.Payload.empid = "B113";
Device.Payload.timestamp = "";


thing.initPayload(Device, cli);
var device = thing.Connect();
//thing.PullSubscriptions(device);

device.publish(Device.PublishTopic, JSON.stringify(Device.Payload), { Qos : 0 }, function (e) {
    console.log("Attendance Logged");
});