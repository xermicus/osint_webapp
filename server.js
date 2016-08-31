var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// redis stuff
var redis = require("redis")
var r= redis.createClient(6379,'10.10.0.107');
r.auth('letmeinplease');
r.on("error", function (err) {
    console.log("Redis Error " + err);
});
r.set("string key", "string val", redis.print);

// Basic routing
app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
        console.log('Client connected...');
        // get data
        socket.on('setkw', function(data) {
                //console.log('got: '+data);
                r.set('keyword', data, redis.print);
        });

        // send data
        var interval = setInterval(function () {
                //socket.emit('get', 'hi');
        }, 3000);
}); 
    
// Run the server
http.listen(80, function(){
        console.log('listening on *:80');
}); 
