var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new mongoose.Schema({
	firstName : {type: String, required: true},
	lastName : {type : String, required: true},
	email : {type : String, required: true},
	phone : {type : String, default: '' },
	address : {type : String, required: true},
	province : {type : String, required: true},
	country : {type : String, default: 'Canada', required: true},
	sin : { type : String},
	date : { type: Date},
});

var Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;