var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    noOfNights: {type: Number, default: 1},
});

module.exports = mongoose.model("Booking", bookingSchema);