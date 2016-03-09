var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OfferSchema = new mongoose.Schema({

	// offer basic info
	title : {type: String,  default: 'New Offer'},
	created : {type: Date, default: new Date() },
 	deadline: {type: Date},
 	closing_date: {type: Date},
 	sale_date:  {type: Date},

 	price: {type: Number},
 	deposit: {type: Number},

 	chattels_included : {type: String, default: ''},
 	fixtures_excluded : {type: String, default: ''},
 	rental_items : {type: String, default: ''},

	// buyer infomation
	buyer_first_name : {type : String,  default: '' },
	buyer_last_name : {type : String,  default: '' },
	buyer_email : {type : String,  default: '' },


	// saller infomation
	saller_first_name : {type : String, default: '' },
	saller_last_name : {type : String, default: '' },
	saller_email : {type : String,  default: '' },

	// property information
	property_address : {type : String, default: ''},
	property_address_fronting_on : {type : String, default: ''},
	property_address_side_of : {type : String, default: ''},
	property_address_in_the : {type : String, default: ''},
	

	// agent object
	agent : { type: mongoose.Schema.ObjectId, ref: 'User', required: true},

	contact: { type: mongoose.Schema.ObjectId, ref: 'Contact', required: true}
});

var Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;