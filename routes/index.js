var express = require("express"),
    router = express.Router();
    passport = require("passport"),
    User = require("../models/user")

//Landing
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("user/register");
})

router.get("/dashboard/:id", function(req, res){
    User.findById(req.params.id, function(error, user){
        if(error) console.log(error);
        else{
            console.log(user);
            res.render("user/user", {user: user});
        }
    })
})

//register user
router.post("/register", function(req, res){
    if(req.body.password == req.body.confirmPassword){
        User.register(new User({
            name: req.body.name,
            username: req.body.username,
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