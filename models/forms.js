var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormSchema = new mongoose.Schema({
	path : {type: String, require},
	created : {type: Date, default: new Date() },
	offer : { type: mongoose.Schema.ObjectId, ref: 'Offer', required: true},
	type : {type: String, default: 'Offer'},
});

var Form = mongoose.model('Form', FormSchema);

module.exports = Form;