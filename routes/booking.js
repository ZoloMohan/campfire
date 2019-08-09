var express = require('express'),
	router = express.Router();

var Booking = require('../models/booking'),
	middleware = require('../middleware/index');
//BookCamp
router.post('/:id/book', function(req, res) {
	Campground.findById(req.params.id, function(error, campground) {
		if (error) console.log(error);
		else {
			if (!(campground.author.id == req.user.id)) {
				Booking.create(
					{
						campground : req.params.id,
						hostId     : campground.author.id,
						user       : {
							id       : req.user.id,
							username : req.user.username
						},
						noOfPeople : {
							adults   : req.body.adults,
							children : req.body.children
						},
						noOfNights : req.body.noOfNights,
						price      :
							(parseInt(req.body.adults) + parseInt(req.body.children)) *
							parseInt(campground.price) *
							parseInt(req.body.noOfNights)
					},
					function(error, booking) {
						if (error) console.log(error);
						else {
							User.findById(req.user.id, function(error, user) {
								if (error) console.log(error);
								else {
									user.userBookings.push(booking.id);
									user.save();
									User.findById(campground.author.id, function(error, host) {
										if (error) console.log(error);
										else {
											host.hostedBookings.push(booking.id);
											host.save();
										}
									});
								}
							});
							res.redirect('/campgrounds/' + req.params.id);
						}
					}
				);
			} else {
				req.flash("You can't book for your own Camp");
				res.redirect('/campgrounds/' + req.params.id);
			}
		}
	});
});

router.put('/:id/book/:booking_id', middleware.isLoggedIn, function(req, res) {
	Booking.findById(req.params.booking_id, function(error, booking) {
		if (error) console.log(error);
		else {
			booking.status = 'verified';
			booking.save();
			res.redirect('/user/' + req.user.id);
		}
	});
});

router.delete('/:id/book/:booking_id', middleware.isLoggedIn, function(req, res) {
	Booking.findByIdAndRemove(req.params.booking_id, function(error) {
		if (error) console.log(error);
		else {
			User.findById(req.user.id, function(error, user) {
				if (error) console.log(error);
				else {
					user.userBookings.splice(user.userBookings.indexOf(req.params.booking_id), 1);
					user.save();
					Campground.findById(req.params.id, function(error, campground) {
						User.findById(campground.author.id, function(error, user) {
							if (error) console.log(error);
							else {
								user.hostedBookings.splice(user.hostedBookings.indexOf(req.params.booking_id, 1));
								user.save();
							}
						});
					});
					res.redirect('/user/' + req.user.id);
				}
			});
		}
	});
});

module.exports = router;
