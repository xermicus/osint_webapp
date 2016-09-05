var map;

var socket = io('http://localhost:2323');

function initialize() {
	var mapProp = {
	center:new google.maps.LatLng(51.508742,-0.120850),
	zoom:5,
	mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}                       
google.maps.event.addDomListener(window, 'load', initialize);

function setkeyword() { 
	var kw = document.getElementById('input').value;
	socket.emit('setkw', kw);
	}

	socket.on("get", function(data) {  
		var myLatLng = {lat: 51.508742, lng: -0.120850};
		var marker = new google.maps.Marker({
		position:myLatLng,
		title:'hi!'
	});
	marker.setMap(map);
});

