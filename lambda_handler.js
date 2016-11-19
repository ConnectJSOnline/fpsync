var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'tbdautomations-hurestic.co9mgkul9wut.us-west-2.rds.amazonaws.com',
    user: 'tbdautomations',
    password: 'Atmega328',
    database: 'hurestic'
});

exports.handler = function (event, context) {
    
    var eventText = JSON.stringify(event, null, 2);
    console.log("Received event:", eventText);
    
    pool.getConnection(function (err, connection) {
        var _query = "INSERT INTO `hurestic`.`swipes` (`empid`, `direction`, `timestamp`, `deviceid`) VALUES ('" + event.empid + "', '" + event.direction.toUpperCase() + "', DATE_ADD(DATE_ADD(UTC_TIMESTAMP(),INTERVAL 5 HOUR), INTERVAL 30 MINUTE), " + event.deviceid + ")";
        console.log("Query:", _query);
        connection.query(_query, function (err, rows) {
            if (err !== null) {
                console.log("Error:" , err);
            }
            connection.release();
            context.succeed(JSON.stringify(event));
        });
    });
};

exports.handler({
    "deviceid": 2102,
    "direction" : "in",
    "empid" : "B113"
}, null);



