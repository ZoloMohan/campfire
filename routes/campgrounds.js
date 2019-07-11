var express = require("express"),
    router = express.Router();
   
var Campground = require("../models/campground"),
    Booking = require("../models/booking"),
    middleware = require("../middleware");


//Index Page
router.get("/", function(req, res){
    Campground.find({}, function(error, campgroundsDB){
        if(error) console.log("Error at /campgrounds GET: Cannot Retrieve Data from db");
        else 
            res.render("campgrounds/index", {campgrounds: campgroundsDB});
    });
});

//Post new camp form
router.get("/new", middleware.isLoggedIn ,function(req, res){
    res.render("campgrounds/new");
})

//Post New Camp
router.post("/", middleware.isLoggedIn ,function(req, res){
    Campground.create(
        {
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.desc,
            author:{
                id: req.user._id,
                username: req.user.username
            },
            coordinates: req.body.coordinates
        }, 
        function(error, campground){
            if(error)
                console.log("Error at /campgrounds POST: Cannot Post Data to db");
            else{
                User.findById(req.user.id, function(error, user){
                    user.createdCamps.push(campground._id);
                    user.save();
                });
            }
        }
    );
    res.redirect("/campgrounds");
})


//Show Camp Details 
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("reviews").exec(function(error, foundCampground){
        if(error){
          console.log("Error at /campmgrounds/:id: Can't Retrieve Campground Details." + error)   
        }
        else res.render("campgrounds/show", {campground: foundCampground}); 
    });
})

//BookCamp
router.post("/:id/book", function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error) console.log(error);
        else{
            Booking.create({
                campground:{
                    id: req.params.id,
                    name: campground.name
                },
                hostId: campground.author.id,
                userId: req.user.id,
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
    })
})


//Edit Camp Form
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundAuthorization ,function(req, res){
    Campground.findById(req.params.id ,function(error, campground){
        if(error) console.log(error);
        else res.render('campgrounds/edit', {campground: campground});
    });
});

//Post Edit
router.put("/:id", middleware.isLoggedIn , middleware.checkCampgroundAuthorization, function(req, res){
    var campgroundFormData = req.body.campground;
    campgroundFormData.coordinates = req.body.coordinates;
    Campground.findByIdAndUpdate(req.params.id, campgroundFormData, function(error, campground){
        if(error){
            console.log(error);
            res.redirect("/campgrounds/"+req.params.id);  
        }
        console.log(campground);
        res.redirect("/campgrounds/"+req.params.id+"");
    })
})

//Delete Campground
router.delete("/:id", middleware.isLoggedIn, middleware.checkCampgroundAuthorization ,function(req, res){
    User.findById(req.user.id, function(error, user){
        for(var i = 0; i < user.createdCamps.length; i++)
            if(user.createdCamps[i].equals(req.params.id)){
                user.createdCamps.splice(i, 1);
                user.save();
                break;
            }
            Campground.findByIdAndRemove(req.params.id, function(error){
            if(error) console.log(error);
            res.redirect("/campgrounds");
        })
    });
})

module.exports = router;