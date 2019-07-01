var express = require("express"),
    router = express.Router({mergeParams: true});

var Campground = require("../models/campground"),
    User       = require("../models/user"),
    Review    = require("../models/review"),
    middleware = require("../middleware");

router.post("/", middleware.isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error) console.log(error);
        else{
            console.log(campground);
            Review.create(req.body.review, function(error, review){
                if(error) console.log(error);
                else{
                    User.findById(req.user.id, function(error, user){
                        user.reviews.push(review._id);
                        user.save();
                        review.campground_id = campground._id;
                        review.author.id = req.user.id;
                        review.author.username = req.user.username;
                        review.save();
                        campground.reviews.push(review._id);
                        campground.save();
                        req.user.reviewedCamps.push(campground._id);
                        req.user.save();
                        req.flash("success", "Review Created")
                        res.redirect("/campgrounds/" + campground._id);
                    })
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
                            for(var j = 0; j < user.reviewedCamps.length;j++)
                                if(user.reviewedCamps[j].equals(campground._id)){
                                    user.reviewedCamps.splice(j,1);
                                    user.save();
                                    break;;
                                }
                            for(var j = 0; j < user.reviews.length; j++)
                                if(user.reviews[j].equals(req.params.review_id)){
                                    console.log("Reached");
                                    user.reviews.splice(j, 1);
                                    user.save();
                                    break;
                                }
                            Review.findByIdAndRemove(req.params.review_id, function(error){
                                if(error) console.log(error);
                                req.flash("success", "review Deleted");
                                res.redirect("/campgrounds/"+req.params.id);
                            });
                        }
                    })
                   
                }
            }
        }
    });  
})
module.exports = router;