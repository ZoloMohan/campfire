var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash         = require('connect-flash'),
    User          = require("./models/user");

var reviewRoutes = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser:true, useFindAndModify: false});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

//passport config
app.use(require("express-session")({
    secret: "I don't know what i am doing with my life.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.alert = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use(indexRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=============================================================================================================================
//  SERVER INIT
//=============================================================================================================================

app.listen(3000, function(){
    console.log("YelpCamp Server started at Port 3000.");
});