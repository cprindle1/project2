var mongoose = require('mongoose');

var codeSchema = mongoose.Schema({
	title: {type: String, required: true},
  code: {type: String, required: true},
  description: String,
});

var code = mongoose.model('code', codeSchema);

module.exports = code;
