// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
	var lat = parseFloat($('#lattitude').val());
	var lng = parseFloat($('#longitude').val());
	var myLatLng = { lat, lng };
	var map = new google.maps.Map(document.getElementById('map'), {
		center : myLatLng,
		zoom   : 13
	});

	var marker = new google.maps.Marker({
		position  : myLatLng,
		draggable : false,
		map       : map
	});
	marker.setVisible(true);
}
