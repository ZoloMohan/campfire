var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    campground:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        },
        name: String
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    noOfPeople: {
        adults: {type: Number, default: 0},
        children: {type: Number, default: 0}
    },
    noOfNights: {type: Number, default: 1},
    price: Number,
    status: {type: String, default: "pending"},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Booking", bookingSchema);