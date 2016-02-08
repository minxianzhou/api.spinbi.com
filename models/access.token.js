var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessTokenSchema = new mongoose.Schema({
	type: {type: String, required: true},
	user : {type: String, required: true },
	created : {type : Date, default : Date.now },
});

var AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = AccessToken;