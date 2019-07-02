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
                        var ratingSum = campground.rating * campground.reviews.length;
                        campground.reviews.push(review._id);
                        ratingSum = ratingSum + review.rating;
                        campground.rating = ratingSum/campground.reviews.length;
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
    Review.findById(req.params.review_id, function(error, review){
        if(error) console.log(error);
        Campground.findById(req.params.id, function(error, campground){
            if(error) console.log(error);
            else{
                var ratingSum = campground.rating * campground.reviews.length;
                ratingSum = ratingSum - review.rating;
                review.content = req.body.review.content;
                review.rating = req.body.review.rating;
                review.save();
                ratingSum = ratingSum + review.rating;
                campground.rating = ratingSum / campground.reviews.length;
                campground.save();
                res.redirect("/campgrounds/"+campground._id);
            }
        })
    })
})

router.delete("/:review_id",middleware.isLoggedIn, middleware.checkReviewAuthorization ,function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error) console.log(error);
        else{
            var ratingSum = campground.rating * campground.reviews.length;
            //To Delete from Campgrounds Review_id Array
            for(var i = 0; i < campground.reviews.length; i++)
                if(campground.reviews[i]._id.equals(req.params.review_id)){
                    campground.reviews.splice(i,1);
                }
            Review.findById(req.params.review_id, function(error, review){
                ratingSum = ratingSum - review.rating;
                if(ratingSum == 0)
                    campground.rating = 0;
                else
                    campground.rating = ratingSum/campground.reviews.length;
                campground.save();
                User.findById(req.user.id, function(error, user){
                    if(error) console.log(error);
                    else{
                        //Remove from Reviewed Camps
                        for(var j = 0; j < user.reviewedCamps.length;j++)
                            if(user.reviewedCamps[j].equals(campground._id)){
                                user.reviewedCamps.splice(j,1);
                                break;
                            }
                        //Remove from User Reviews List
                        for(var j = 0; j < user.reviews.length; j++)
                            if(user.reviews[j].equals(req.params.review_id)){
                                user.reviews.splice(j, 1);
                                break;
                            }
                        user.save();
                        //Actual Delete Code
                        Review.findByIdAndRemove(req.params.review_id, function(error){
                            if(error) console.log(error);
                            req.flash("success", "review Deleted");
                            res.redirect("/campgrounds/"+req.params.id);
                        });
                    }
                })
            })
        }
    });  
})
module.exports = router;