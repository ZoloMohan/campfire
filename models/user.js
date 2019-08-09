var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	name           : {
		first : String,
		last  : String
	},
	dob            : Date,
	email          : String,
	username       : String,
	contact        : Number,
	password       : String,
	createdCamps   : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'Campground'
		}
	],
	reviewedCamps  : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'Campground'
		}
	],
	reviews        : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'Review'
		}
	],
	userBookings   : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'Booking'
		}
	],
	hostedBookings : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'Booking'
		}
	],
	created        : { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
