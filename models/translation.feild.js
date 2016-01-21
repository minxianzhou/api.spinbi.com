var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TranslationFeildSchema = new mongoose.Schema({
	language : {type: String, required: true},
	pattern : {type : String, required: true},
	text : { type : String, required: true},
	length : {type: Number}
});

var TranslationFeild = mongoose.model('Translation_Feild', TranslationFeildSchema);

module.exports =TranslationFeild;