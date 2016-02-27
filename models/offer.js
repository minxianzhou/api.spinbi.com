var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OfferSchema = new mongoose.Schema({

	// offer basic info
	title : {type: String, required: true},
	created : {type: Date, required: true, default: new Date() },

	// buyer infomation
	buyer_first_name : {type : String, required: true， default: '' },
	buyer_last_name : {type : String, required: true， default: '' },


	// saller infomation
	saller_first_name : {type : String, required: true， default: '' },
	saller_last_name : {type : String, required: true， default: '' },


	// property information
	property_address : {type : String, required: true, default: ''},
	property_address : {type : String, required: true, default: ''},
	

	// agent object
	agent : { type: mongoose.Schema.ObjectId, ref: 'User', required: true}
});

var Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;