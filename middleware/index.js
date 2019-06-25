var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

var middleware = {
    checkCommentAuthorization: function (req, res, next){
        Comment.findById(req.params.comment_id, function(error, comment){
            if(error) res.redirect("back");
            else{
                if(comment.author.id.equals(req.user.id)){
                    next();
                }
                else {
                    req.flash("error", "You are not authorized to perform this action");
                    res.redirect("back");
                }
            }
        })
    },

    checkCampgroundAuthorization: function (req, res, next){
        Campground.findById(req.params.id, function(error, campground){
            if(error){
                console.log(error);
                req.flash("error", "Database Error! Campground Not found");
                res.redirect("back");
            }
            else{
                if(campground.author.id.equals(req.user._id))
                    next();
                else{
                    req.flash("error", "You are not authorized to perform this action.")
                    res.redirect("back");
                }    
            }
        });
    },
    

    isLoggedIn: function (req, res, next){
        if(req.isAuthenticated())
            return next();
        req.flash("error", "You Need to login to perform this action."); 
        return res.redirect("/login");
    }
}

module.exports = middleware;