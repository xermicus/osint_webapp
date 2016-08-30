var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Basic routing
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('Client connected...');
	socket.on('set_keyword', function(data) {
		console.log(data.message);
	});

	var interval = setInterval(function () {
        	//socket.emit('get', 'hi');
    	}, 1000);
});

// Run the server
http.listen(80, function(){
	console.log('listening on *:80');
});
