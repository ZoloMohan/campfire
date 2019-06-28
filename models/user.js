var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    reviewedCamps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "campground"
        }
    ],
    created: {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);