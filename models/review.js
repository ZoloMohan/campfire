var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
	author     : {
		id: {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'User'
		},
		username : String
	},
	campground : {
		id: {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'Campground'
		},
		name : String
	},
	content    : String,
	rating     : Number,
	created    : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
