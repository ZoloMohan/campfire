var express = require("express"),
    router = express.Router({mergeParams: true});

    
var Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

router.post("/", middleware.isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error) console.log(error);
        else{
            Comment.create(req.body.comment, function(error, comment){
                if(error) console.log(error);
                else{
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Comment Created")
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }   
    })
})

router.get("/:comment_id/edit",middleware.isLoggedIn,middleware.checkCommentAuthorization ,function(req, res){
        Comment.findById(req.params.comment_id, function(error, comment){
            if(error) res.redirect("back");
            else
            res.render("comments/new", {comment: comment, campground: req.params.id});
        })
})

router.put("/:comment_id", middleware.isLoggedIn, middleware.checkCommentAuthorization,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, comment){
        if(error){
            console.log(error);
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

router.delete("/:comment_id",middleware.isLoggedIn, middleware.checkCommentAuthorization ,function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error) console.log(error);
        else{
            for(var i = 0; i < campground.comments.length; i++){
                if(campground.comments[i]._id.equals(req.params.comment_id)){
                    campground.comments.splice(i,1);
                    campground.save();
                    Comment.findByIdAndRemove(req.params.comment_id, function(error){
                        if(error) console.log(error);
                        req.flash("success", "Comment Deleted");
                        res.redirect("/campgrounds/"+req.params.id);
                    });
                }
            }
        }
    });
    
})

module.exports = router;