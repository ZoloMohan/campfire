var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    email: String,
    username: String,
    password: String,
    createdCamps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        }
    ],
    reviewedCamps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        }
    ],
    reviews:[
        {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Review"
        }
    ],
    created: {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);