var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TranslationFeildSchema = new mongoose.Schema({
	language : {type: String},
	pattern : {type : String},
	text : { type : String},
	length : {type: Number}
});

var TranslationFeild = mongoose.model('Translation_Feild', TranslationFeildSchema);

module.exports =TranslationFeild;