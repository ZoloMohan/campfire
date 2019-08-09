$('.nav-link').click(function() {
	document.querySelectorAll('.nav-link').forEach(function(el) {
		if (el.classList.contains('active')) el.classList.remove('active');
	});
	this.className += ' active';
});

var reviewsSection = $('#reviews'),
	bookingsSection = $('#bookings'),
	campgroundsSection = $('#campgrounds');

$('.nav-tabs .nav-item .nav-link').click(function() {
	[ reviewsSection, bookingsSection, campgroundsSection ].forEach(function(section) {
		section.addClass('d-none');
	});
	if (this.id === 'reviewsView') reviewsSection.removeClass('d-none');
	else if (this.id === 'bookingsView') bookingsSection.removeClass('d-none');
	else if (this.id === 'campgroundsView') campgroundsSection.removeClass('d-none');
});
