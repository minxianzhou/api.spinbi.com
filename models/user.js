var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
	firstName : {type: String, required: true},
	lastName : {type : String, required: true},
	company : {type : String, default: ''},
	email : {type : String, required: true},
	phone : {type : String, default: '' },
	address : {type : String, required: true},
	province : {type : String, required: true},
	country : {type : String, default: 'Canada', required: true},
	type : { type : String, required: true},
	date : { type: Date}
});

var User = mongoose.model('User', UserSchema);

module.exports =User;