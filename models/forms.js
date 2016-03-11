var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormSchema = new mongoose.Schema({
	path : {type: String, require},
	created : {type: Date, default: new Date() },
	client : { type: mongoose.Schema.ObjectId, ref: 'Contact', required: true},
	type : {type: String, },
});

var Form = mongoose.model('Form', FormSchema);

module.exports = Form;