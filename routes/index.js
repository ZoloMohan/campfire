var express = require("express"),
    router = express.Router();
    passport = require("passport"),
    User = require("../models/user")

//Landing
router.get("/", function(req, res){
    res.render("index");
});

//show register form
router.get("/register", function(req, res){
    res.render("auth/register");
})

//register user
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", error.message);
            res.render('auth/register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+ user.username)
            res.redirect("/campgrounds");
        });
    })
})

//login Form
router.get("/login", function(req, res){
    res.render("auth/login");
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