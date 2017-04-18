var mongoose = require('mongoose');

var codeSchema = mongoose.Schema({
	title: {type: String, required: true},
  code: {type: String, required: true},
  description: String,
	userID: String,
	public: Boolean,
	tags: []
});

codeSchema.index({description: 'text', tags: 'text', code: 'text', title: 'text'});

var code = mongoose.model('code', codeSchema);

module.exports = code;
