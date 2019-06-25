var express = require("express"),
    router = express.Router();
   
var Campground = require("../models/campground"),
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
            }
        }, 
        function(error, campground){
            if(error) {
                console.log("Error at /campgrounds POST: Cannot Post Data to db");
            }
            else console.log(campground);
        }
    );
    res.redirect("/campgrounds");
})


//Show Camp Details 
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if(error){
          console.log("Error at /campmgrounds/:id: Can't Retrieve Campground Details.")   
        }
        else res.render("campgrounds/show", {campground: foundCampground}); 
    });
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
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, campground){
        if(error){
            console.log(error);
            res.redirect("/campgrounds/"+req.params.id);  
        }
        res.redirect("/campgrounds/"+req.params.id+"");
    })
})

router.delete("/:id", middleware.isLoggedIn, middleware.checkCampgroundAuthorization ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error){
        if(error) console.log(error);
        res.redirect("/campgrounds");
    })
})

module.exports = router;