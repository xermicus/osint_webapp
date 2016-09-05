var app = require('express')();
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

app.get('/client.js', function(req, res) {
	res.sendFile(__dirname + '/client.js');
});

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
		txt = ''
		loc = ''
		r.spop(['done'], function(err, reply) { 
			pk = reply;
			console.log(reply);
			r.hgetall(pk.toString(), function(err, reply) {
				if(err) { console.log(err) } else {
					txt = reply.text;
					loc = reply.location;
					rep = reply.class;
					console.log(txt);
					//console.log(loc);
					console.log(rep);
					googleMapsClient.geocode({
					address: loc
					}, function(err, response) {
						if (!err) {
							console.log(response.json.results);
						}
					});
				}
			});
		});
		
		//loc = r.hget(pk, 'location', redis.print);
		//socket.emit('get', 'hi');

        }, 3000);
}); 
    
// Run the server
http.listen(80, function(){
        console.log('listening on *:80');
}); 
