var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OfferSchema = new mongoose.Schema({

	// offer basic info
	title : {type: String,  default: 'New Offer'},
	created : {type: Date, default: new Date() },
 	deadline: {type: Date},
 	closing_date: {type: Date},

	// buyer infomation
	buyer_first_name : {type : String,  default: '' },
	buyer_last_name : {type : String,  default: '' },


	// saller infomation
	saller_first_name : {type : String, default: '' },
	saller_last_name : {type : String, rdefault: '' },


	// property information
	property_address : {type : String, default: ''},
	property_address : {type : String, default: ''},
	

	// agent object
	agent : { type: mongoose.Schema.ObjectId, ref: 'User', required: true},

	contact: { type: mongoose.Schema.ObjectId, ref: 'Contact', required: true}
});

var Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;