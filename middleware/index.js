var Campground = require('../models/campground'),
		Review = require('../models/review');

var middleware = {
	checkReviewAuthorization     : function(req, res, next) {
		Review.findById(req.params.review_id, function(error, review) {
			if (error) res.redirect('back');
			else {
				if (review.author.id.equals(req.user.id)) {
					next();
				} else {
					req.flash('error', 'You are not authorized to perform this action');
					res.redirect('back');
				}
			}
		});
	},

	checkCampgroundAuthorization : function(req, res, next) {
		Campground.findById(req.params.id, function(error, campground) {
			if (error) {
				console.log(error);
				req.flash('error', 'Database Error! Campground Not found');
				res.redirect('back');
			} else {
				if (campground.author.id.equals(req.user._id)) next();
				else {
					req.flash('error', 'You are not authorized to perform this action.');
					res.redirect('back');
				}
			}
		});
	},

	checkDashboardAuthorization: function(req,res, next){
		if(req.params.id === req.user.id)
			return next();
		req.flash('error', 'You Are Not Authorized to View Others Dashboard');
		return res.redirect('/campgrounds');
	},

	isLoggedIn                   : function(req, res, next) {
		if (req.isAuthenticated()) return next();
		req.flash('error', 'You Need to login to perform this action.');
		return res.redirect('/login');
	}
};

module.exports = middleware;
