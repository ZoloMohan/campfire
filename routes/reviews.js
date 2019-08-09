var express = require('express'),
	router = express.Router({ mergeParams: true });

var Campground = require('../models/campground'),
	User = require('../models/user'),
	Review = require('../models/review'),
	middleware = require('../middleware');

router.post('/', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(error, campground) {
		if (error) console.log(error);
		else {
			Review.create(req.body.review, function(error, review) {
				if (error) console.log(error);
				else {
					User.findById(req.user.id, function(error, user) {
						if (error) console.log(error);
						else {
							user.reviews.push(review._id);
							user.save();
							review.campground.id = campground._id;
							review.campground.name = campground.name;
							review.author.id = req.user.id;
							review.author.username = req.user.username;
							review.save();
							var ratingSum = campground.rating * campground.reviews.length;
							campground.reviews.push(review._id);
							ratingSum = ratingSum + review.rating;
							campground.rating = ratingSum / campground.reviews.length;
							campground.ratingsNumber[review.rating] += 1;
							campground.save();
							req.user.reviewedCamps.push(campground._id);
							req.user.save();
							req.flash('success', 'Review Posted');
							res.redirect('/campgrounds/' + campground._id);
						}
					});
				}
			});
		}
	});
});

router.put('/:review_id', middleware.isLoggedIn, middleware.checkReviewAuthorization, function(req, res) {
	Review.findById(req.params.review_id, function(error, review) {
		if (error) console.log(error);
		Campground.findById(req.params.id, function(error, campground) {
			if (error) console.log(error);
			else {
				campground.ratingsNumber[review.rating] -= 1;
				var ratingSum = campground.rating * campground.reviews.length;
				ratingSum = ratingSum - review.rating;
				review.content = req.body.review.content;
				review.rating = req.body.review.rating;
				review.save();
				ratingSum = ratingSum + review.rating;
				campground.ratingsNumber[review.rating] += 1;
				campground.rating = ratingSum / campground.reviews.length;
				campground.save();
				res.redirect('/campgrounds/' + campground._id);
			}
		});
	});
});

router.delete('/:review_id', middleware.isLoggedIn, middleware.checkReviewAuthorization, function(req, res) {
	Campground.findById(req.params.id, function(error, campground) {
		if (error) console.log(error);
		else {
			var ratingSum = campground.rating * campground.reviews.length;
			//To Delete from Campgrounds Review_id Array
			campground.reviews.splice(campground.reviews.indexOf(req.params.review_id), 1);
			Review.findById(req.params.review_id, function(error, review) {
				if (error) console.log(error);
				else {
					ratingSum = ratingSum - review.rating;
					campground.ratingsNumber[review.rating] -= 1;
					if (ratingSum == 0) campground.rating = 0;
					else campground.rating = ratingSum / campground.reviews.length;
					campground.save();
					User.findById(req.user.id, function(error, user) {
						if (error) console.log(error);
						else {
							user.reviewedCamps.splice(user.reviewedCamps.indexOf(campground._id), 1);
							user.reviews.splice(user.reviews.indexOf(req.params.review_id), 1);
							user.save();
							Review.findByIdAndRemove(req.params.review_id, function(error) {
								if (error) console.log(error);
								res.redirect('/campgrounds/' + campground.id);
							});
						}
					});
				}
			});
		}
	});
});
module.exports = router;
