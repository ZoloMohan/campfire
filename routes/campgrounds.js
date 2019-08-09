var express = require('express'),
	router = express.Router();

var Campground = require('../models/campground'),
	middleware = require('../middleware');

//Index Page
router.get('/', function(req, res) {
	Campground.find({}, function(error, campgroundsDB) {
		if (error) console.log('Error at /campgrounds GET: Cannot Retrieve Data from db');
		else res.render('campgrounds/index', { campgrounds: campgroundsDB });
	});
});

//Post new camp form
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

//Post New Camp
router.post('/', middleware.isLoggedIn, function(req, res) {
	Campground.create(
		{
			name        : req.body.name,
			price       : req.body.price,
			image       : req.body.image,
			description : req.body.desc,
			author      : {
				id       : req.user._id,
				username : req.user.username
			},
			coordinates : req.body.coordinates
		},
		function(error, campground) {
			if (error) console.log('Error at /campgrounds POST: Cannot Post Data to db');
			else {
				User.findById(req.user.id, function(error, user) {
					if (error) console.log(error);
					else {
						user.createdCamps.push(campground._id);
						user.save();
					}
				});
				req.flash('success', `${campground.name} Added`);
				res.redirect('/campgrounds');
			}
		}
	);
});

//Show Camp Details
router.get('/:id', function(req, res) {
	Campground.findById(req.params.id).populate('reviews').exec(function(error, foundCampground) {
		if (error) {
			console.log("Error at /campmgrounds/:id: Can't Retrieve Campground Details." + error);
		} else res.render('campgrounds/show', { campground: foundCampground });
	});
});

//Edit Camp Form
router.get('/:id/edit', middleware.isLoggedIn, middleware.checkCampgroundAuthorization, function(req, res) {
	Campground.findById(req.params.id, function(error, campground) {
		if (error) console.log(error);
		else res.render('campgrounds/edit', { campground: campground });
	});
});

//Post Edit
router.put('/:id', middleware.isLoggedIn, middleware.checkCampgroundAuthorization, function(req, res) {
	var campgroundFormData = req.body.campground;
	campgroundFormData.coordinates = req.body.coordinates;
	Campground.findByIdAndUpdate(req.params.id, campgroundFormData, function(error, campground) {
		if (error) console.log(error);
		else req.flash('success', `${campground.name} Edited Successfully`);
		res.redirect('/campgrounds/' + req.params.id);
	});
});

//Delete Campground
router.delete('/:id', middleware.isLoggedIn, middleware.checkCampgroundAuthorization, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(error, campground) {
		if (error) console.log(error);
		else {
			User.findById(req.user.id, function(error, user) {
				if (error) console.log(error);
				else {
					user.createdCamps.splice(user.createdCamps.indexOf(req.params.id), 1);
					user.save();
				}
			});
			req.flash('success', `${campground.name} Sucessfully Deleted`);
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
