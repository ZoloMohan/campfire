var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
	campground : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'Campground'
	},
	hostId     : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'User'
	},
	user       : {
		id       : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'User'
		},
		username : String
	},
	noOfPeople : {
		adults   : { type: Number, default: 0 },
		children : { type: Number, default: 0 }
	},
	noOfNights : { type: Number, default: 1 },
	price      : Number,
	status     : { type: String, default: 'pending' },
	date       : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
