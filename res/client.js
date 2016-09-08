var map;
var pospin = new google.maps.MarkerImage("pos.png");
var negpin = new google.maps.MarkerImage("neg.png");
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

socket.on('get', function(data) {
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': data.location }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
        			var marker = new google.maps.Marker({
	       				map: map,
					position: results[0].geometry.location,
					title: data.text
			});
			if(data.class == 'pos') {
				marker.setIcon(pospin);
			}
			else if (data.class == 'neg') {
				marker.setIcon(negpin);
			}
			marker.setMap(map);
		}
	});
});

