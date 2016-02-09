var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
	firstName : {type: String, required: true},
	lastName : {type : String, required: true},
	email : {type : String, required: true},
	password : {type : String, required: true},
	status : {type : String, required: true, default: 'Pending'},
	company : {type : String, default: ''},
	phone : {type : String, default: '' },
	address : { type: mongoose.Schema.ObjectId, ref: 'Address'},
	type : { type : String, required: true, default: 'Normal'},
	date : { type: Date, required: true}
});

var User = mongoose.model('User', UserSchema);

module.exports =User;