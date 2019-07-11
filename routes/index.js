var express = require("express"),
    router = express.Router();
    passport = require("passport"),
    User = require("../models/user"),
    Campground = require("../models/campground"),
    Booking = require('../models/booking')

//Landing
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("user/register");
})

router.get("/dashboard/:username", function(req, res){
    var userBookings = [];
    if(req.user.userBookings !== undefined){
        req.user.userBookings.forEach(function(bookingID){
            Booking.findById(bookingID, function(error, booking){
               if(error) console.log(error);
               else{
                   userBookings.push(booking);
                    console.log(userBookings);
               }
            })
        })
   }
   var hostBookings = [];
   if(req.user.hostBookings !== undefined){
       req.user.hostBookings.forEach(function(bookingID){
           Booking.findById(bookingID, function(error, booking){
               if(error) console.log(error);
               else hostBookings.push(booking);
           })
       })
   }
   res.render("user/user", {userbookings: userBookings, hostBookings: hostBookings});
})

//register user
router.post("/register", function(req, res){
    if(req.body.password == req.body.confirmPassword){
        User.register(new User({
            name: {
                first: req.body.firstname,
                last: req.body.lastname
            },
            username: req.body.username,
            contact: req.body.contact,
            email: req.body.email
        }), req.body.password, function(error, user){
            if(error){
                console.log(error);
                req.flash("error", error.message);
                res.render('user/register');
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp "+ user.username)
                res.redirect("/campgrounds");
            });
        })
    }
    else{
        console.log("Passwords Don't Match")
        req.flash("Passwords Don't Match");
        res.redirect("/register");
    }
   
})

//login Form
router.get("/login", function(req, res){
    res.render("user/login");
})

//login User
router.post("/login", passport.authenticate("local", { 
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){});


//logout User
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/");
})

module.exports = router;