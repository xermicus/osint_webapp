var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var googleMapsClient = require('@google/maps').createClient({
	key: ''
});

// redis stuff
var redis = require("redis")
var r= redis.createClient(6379,'10.10.0.107');
r.auth('letmeinplease');
r.on("error", function (err) {
    console.log("Redis Error: " + err);
});

// Basic routing
app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
});

app.use(express.static('res'));

// socket.io
io.on('connection', function(socket) {
        console.log('Client connected...');
        // get data
        socket.on('setkw', function(data) {
                console.log('got: '+data);
                r.set('keyword', data, redis.print);
        });

        // send data
        var interval = setInterval(function () {
                r.setnx('keyword', 'unset');
		pk = 0
		r.spop(['done'], function(err, reply) { 
			if (err) { console.log(err) } else if (reply) {
			pk = reply;
			r.hgetall(pk.toString(), function(err, reply) {
				if(err) { console.log(err) } else if (reply) {
					socket.emit('get', reply);
				}
			});
			}
		});
		

        }, 3000);
}); 
    
// Run the server
http.listen(80, function(){
        console.log('listening on *:80');
}); 
