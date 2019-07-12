var express = require('express'),
    router = express.Router();

var Booking = require('../models/booking'),
    middleware = require('../middleware/index');
//BookCamp
router.post("/:id/book", function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error) console.log(error);
        else{
            if(!(campground.author.id == req.user.id)){
                Booking.create({
                    campground:{
                        id: req.params.id,
                        name: campground.name
                    },
                    hostId: campground.author.id,
                    user:{
                        id:req.user.id,
                        username: req.user.username
                    },
                    noOfPeople:{
                        adults: req.body.adults,
                        children: req.body.children
                    },
                    noOfNights:req.body.noOfNights,
                    price: (req.body.adults + req.body.children) * campground.price * req.body.noOfNights
                }, function(error, booking){
                    if(error) console.log(error);
                    else{
                        User.findById(req.user.id, function(error, user){
                            if(error) console.log(error);
                            else{
                                user.userBookings.push(booking.id);
                                user.save();
                                User.findById(campground.author.id, function(error, host){
                                    if(error) console.log(error);
                                    else{
                                        host.hostedBookings.push(booking.id);
                                        host.save();
                                    }
                                })
                            }
                        })
                        res.redirect("/campgrounds/"+req.params.id);
                    }
                })
            }
            else{
                console.log("ou can't book for your own Camp");
                req.flash("You can't book for your own Camp");
                res.redirect("/campgrounds/"+req.params.id);
            }
        }
    })
})

router.put("/:id/book/:booking_id",middleware.isLoggedIn, function(req, res){
    Booking.findById(req.params.booking_id, function(error, booking){
        if(error) console.log(error);
        else{
            booking.status = "verified";
            booking.save();
            res.redirect("/user/"+req.user.id);
        }
    })
})


module.exports = router;