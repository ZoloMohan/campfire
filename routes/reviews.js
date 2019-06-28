var express = require("express"),
    router = express.Router({mergeParams: true});

var Campground = require("../models/campground"),
    User       = require("../models/user"),
    Review    = require("../models/review"),
    middleware = require("../middleware");

router.post("/", middleware.isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error) console.log(error);
        else{
            Review.create(req.body.review, function(error, review){
                if(error) console.log(error);
                else{
                    review.author.id = req.user.id;
                    review.author.username = req.user.username;
                    review.save();
                    foundCampground.reviews.push(review);
                    foundCampground.save();
                    req.user.reviewedCamps.push(foundCampground._id);
                    req.user.save();
                    req.flash("success", "Review Created")
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }   
    })
})

router.put("/:review_id", middleware.isLoggedIn, middleware.checkReviewAuthorization,function(req, res){
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(error, review){
        if(error){
            console.log(error);
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

router.delete("/:review_id",middleware.isLoggedIn, middleware.checkReviewAuthorization ,function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error) console.log(error);
        else{
            for(var i = 0; i < campground.reviews.length; i++){
                if(campground.reviews[i]._id.equals(req.params.review_id)){
                    campground.reviews.splice(i,1);
                    campground.save();
                    User.findById(req.user.id, function(error, user){
                        if(error) console.log(error);
                        else{
                            for(var j = 0; j < user.reviewedCamps.length;j++){
                                console.log(user.reviewedCamps.length)
                                if(user.reviewedCamps[j].equals(campground._id)){
                                    user.reviewedCamps.splice(j,1);
                                    user.save();
                                    Review.findByIdAndRemove(req.params.review_id, function(error){
                                        if(error) console.log(error);
                                        req.flash("success", "review Deleted");
                                        res.redirect("/campgrounds/"+req.params.id);
                                    });
                                }
                            }
                        }
                    })
                   
                }
            }
        }
    });
    
})

module.exports = router;