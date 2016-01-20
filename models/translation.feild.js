var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TranslationFeildSchema = new mongoose.Schema({
	title : {type : String},
	
});

var TranslationFeild = mongoose.model('Translation_Feild', TranslationFeildSchema);

module.exports =TranslationFeild;