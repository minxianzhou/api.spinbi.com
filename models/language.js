var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguageSchema = new mongoose.Schema({
	Language : {type : String},
	Short : {type : String},
});

var Language = mongoose.model('Language', LanguageSchema);

module.exports =Language;