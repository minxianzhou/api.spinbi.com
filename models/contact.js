var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new mongoose.Schema({
	firstName : {type: String, required: true},
	lastName : {type : String, required: true},
	legalFirstName : {type : String, required: true},
	legalLastName : {type : String, required: true},
	email : {type : String, required: true},
	phone : {type : String, default: '' },
	user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true},
	currentAddress: { type: mongoose.Schema.ObjectId, ref: 'Address'},
	movingAddress: { type: mongoose.Schema.ObjectId, ref: 'Address'},
	sin : { type : String},
	date : { type: Date},
});

var Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;