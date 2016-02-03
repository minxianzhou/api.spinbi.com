var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new mongoose.Schema({
	firstName : {type: String, required: true},
	lastName : {type : String, required: true},
	legalFirstName : {type : String, required: true},
	legalLastName : {type : String, required: true},
	email : {type : String, required: true},
	phone : {type : String, default: '' },
	currentAddress: { type: mongoose.Schema.ObjectId, ref: 'address'},
	movingAddress: { type: mongoose.Schema.ObjectId, ref: 'address'},
	sin : { type : String},
	date : { type: Date},
});

var Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;