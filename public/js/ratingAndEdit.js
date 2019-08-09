var cousin;

$('.ui.rating').rating('disable');
$('.ui.rating.interactable').rating();

$('.ui.rating.interactable').rating('setting', 'onRate', function(value) {
	$('#ratingField').val(value);
});

$('.ui.rating.interactable.edit').rating('setting', 'onRate', function(value) {
	console.log(value);
	cousin.eq(0).children().eq(0).children().eq(1).val(value);
});

function toggleEditForm(element) {
	cousin = $(element).parent().parent().children().eq(2).children();
	let form = cousin.eq(0),
		editRatingInteract = form.children().eq(1),
		displayText = cousin.eq(1),
		displayRating = cousin.eq(2);

	displayToggle = [ form, editRatingInteract, displayRating, displayText ];
	displayToggle.forEach(function(element) {
		element.toggleClass('d-none');
	});

	if ($(element).text() == 'Cancel') $(element).text('Edit');
	else $(element).text('Cancel');
}
