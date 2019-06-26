var marker;
function initMap() {
  
   var myLatLng = {lat: 40.7505, lng: -73.9934};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center:myLatLng
  });
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
	
	     marker = new google.maps.Marker({
          position: myLatLng,
          draggable:true,
          map: map
        });
        
  google.maps.event.addListener(map, 'click', function(e) {
       updateMarkerPosition(marker,e);
   });
   
   marker.addListener('dragend', function() {
    var currentlatlng = marker.position;
    var newAddress = geocoder.geocode(currentlatlng);
    
     geocoder.geocode({'location': currentlatlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
  
        marker.setPosition(latlng);
        map.setCenter(marker.getPosition());
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
    console.log("new address is "+newAddress);
    console.log("latlng is "+ JSON.stringify(currentlatlng) );
    map.setCenter(marker.getPosition());
  });
   
}

function updateMarkerPosition(marker, e){
	marker.setPosition(e.latLng);
}
