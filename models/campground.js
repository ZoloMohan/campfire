var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
	author        : {
		id: {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'User'
		},
		username : String
	},
	name          : String,
	price         : String,
	rating        : { type: Number, default: 0 },
	image         : String,
	description   : String,
	coordinates   : {
		lat  : String,
		long : String
	},
	reviews       : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'Review'
		}
	],
	ratingsNumber : {
		5 : { type: Number, default: 0 },
		4 : { type: Number, default: 0 },
		3 : { type: Number, default: 0 },
		2 : { type: Number, default: 0 },
		1 : { type: Number, default: 0 }
	},
	created       : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campground', campgroundSchema);
