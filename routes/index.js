var express = require('express'),
	router = express.Router();
(passport = require('passport')),
	(User = require('../models/user')),
	(Campground = require('../models/campground')),
	(Booking = require('../models/booking')),
	(middleware = require('../middleware'));

//Landing
router.get('/', function(req, res) {
	res.render('landing');
});

//show register form
router.get('/register', function(req, res) {
	res.render('user/register');
});

//Dashboard
router.get('/user/:id', middleware.isLoggedIn, middleware.checkDashboardAuthorization, function(req, res) {
	User.findById(req.params.id)
		.populate({
			path     : 'userBookings',
			populate : {
				path  : 'campground',
				model : 'Campground'
			}
		})
		.populate({
			path     : 'hostedBookings',
			populate : {
				path  : 'campground',
				model : 'Campground'
			}
		})
		.populate('createdCamps')
		.populate('reviews')
		.exec(function(error, user) {
			if (error) console.log(error);
			else res.render('user/dashboard', { user: user });
		});
});

//register user
router.post('/register', function(req, res) {
	if (req.body.password == req.body.confirmPassword) {
		User.register(
			new User({
				name     : {
					first : req.body.firstname,
					last  : req.body.lastname
				},
				username : req.body.username,
				contact  : req.body.contact,
				email    : req.body.email
			}),
			req.body.password,
			function(error, user) {
				if (error) {
					req.flash('error', error.message);
					res.redirect('/register');
				}
				passport.authenticate('local')(req, res, function() {
					req.flash('success', `Welcome to Campfire ${user.name.first} ${user.name.last}`);
					res.redirect('/campgrounds');
				});
			}
		);
	} else {
		req.flash("Passwords Don't Match");
		res.redirect('/register');
	}
});

//login Form
router.get('/login', function(req, res) {
	req.flash('error');
	res.render('user/login');
});

//login User
router.post(
	'/login',
	passport.authenticate('local', { successRedirect: '/campgrounds', failureRedirect: '/login', failureFlash: true })
);

//logout User
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Logged You Out!');
	res.redirect('/');
});

module.exports = router;
