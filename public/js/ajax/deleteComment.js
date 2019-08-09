var reviewDeleteBtn = $('#reviewDeleteBtn');

reviewDeleteBtn.on('click', function() {
	var campID = reviewDeleteBtn
			.parent()
			.parent()
			.parent()
			.parent()
			.parent()
			.parent()
			.parent()
			.parent()
			.parent()
			.eq(0)
			.children()
			.eq(0)
			.attr('id'),
		reviewID = reviewDeleteBtn.parent().parent().parent().attr('id');
	$.ajax({
		type : 'POST',
		url  : '/campgrounds/' + campID + '/reviews/' + reviewID + '?_method=DELETE'
	})
		.done(function() {
			$('body').toast({
				title   : 'Success',
				message : 'Review Deleted',
				class   : 'success'
			});
			let noOfRatings = parseInt($('#noOfRatings').text());
			reviewDeleteBtn.parent().parent().parent().fadeOut(function() {
				this.remove();
			});
			$('#noOfRatings').text(noOfRatings - 1);
			$('#reviewBtn')
				.parent()
				.html(
					'<a class="btn btn-primary px-4 my-md-0 my-2	" id="reviewBtn"  data-toggle="modal" data-target="#addReviewModal"> Leave a Review </a>'
				);
			if(noOfRatings - 1 === 0) {
				$('.ui.comments #comments').html('<p class="lead" id="noReviewsText">No Reviews Yet. Be the first one to leave a review!</p>')
			}
		})
		.fail(function(err) {
			$('body').toast({
				title   : 'Oops!',
				message : 'Review Delete Failed! Try Again Later',
				class   : 'error'
			});
		});
});
