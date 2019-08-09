// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
	let lat = parseFloat($('#latitude').val());
	let lng = parseFloat($('#longitude').val());
	console.log(lat);
	console.log(lng);
	var myLatLng = { lat, lng };
	var map = new google.maps.Map(document.getElementById('map'), {
		center : myLatLng,
		zoom   : 13
	});

	console.log(myLatLng);
	var input = document.getElementById('pac-input');

	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	// Specify just the place data fields that you need.
	autocomplete.setFields([ 'place_id', 'geometry', 'name' ]);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var infowindow = new google.maps.InfoWindow();
	var infowindowContent = document.getElementById('infowindow-content');
	infowindow.setContent(infowindowContent);

	var marker = new google.maps.Marker({
		position  : myLatLng,
		draggable : true,
		map       : map
	});
	marker.setVisible(true);

	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});

	autocomplete.addListener('place_changed', function() {
		infowindow.close();

		var place = autocomplete.getPlace();

		if (!place.geometry) {
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}

		// Set the position of the marker using the place ID and location.
		marker.setPosition(place.geometry.location);

		infowindowContent.children['place-name'].textContent = place.name;
		infowindowContent.children['place-id'].textContent = place.place_id;
		infowindowContent.children['place-address'].textContent = place.formatted_address;
		// infowindow.open(map, marker);
		myLatLng.lat = marker.position.lat();
		myLatLng.lng = marker.position.lng();
		$('input[name="coordinates[lat]"]').val(myLatLng.lat);
		$('input[name="coordinates[long]"]').val(myLatLng.lng);
		$('input[name="campground[coordinates[lat]]"]').val(myLatLng.lat);
		$('input[name="campground[coordinates[long]]"]').val(myLatLng.lng);
	});

	//marker events
	marker.addListener('dragend', function() {
		myLatLng.lat = marker.position.lat();
		myLatLng.lng = marker.position.lng();
		$('input[name="coordinates[lat]"]').val(myLatLng.lat);
		$('input[name="coordinates[long]"]').val(myLatLng.lng);
		$('input[name="campground[coordinates[lat]]"]').val(myLatLng.lat);
		$('input[name="campground[coordinates[long]]"]').val(myLatLng.lng);
	});

	google.maps.event.addListener(map, 'click', function(e) {
		marker.setPosition(e.latLng);
		marker.setVisible(true);
		myLatLng.lat = marker.position.lat();
		myLatLng.lng = marker.position.lng();
		$('input[name="coordinates[lat]"]').val(myLatLng.lat);
		$('input[name="coordinates[long]"]').val(myLatLng.lng);
		$('input[name="campground[coordinates[lat]]"]').val(myLatLng.lat);
		$('input[name="campground[coordinates[long]]"]').val(myLatLng.lng);
	});
}
