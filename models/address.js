var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new mongoose.Schema({
	address : {type: String, required: true},
	city : {type: String, required: true},
	province : {type : String, required: true， default: 'Ontario' },
	country : {type : String, required: true, default: 'Canada'},
	zip : {type : String, required: true},
});

var Address = mongoose.model('Contact', AddressSchema);

module.exports = Address;