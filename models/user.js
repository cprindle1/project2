var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Code = require('./code.js');

var userSchema = Schema({
  username: String,
  password: String,
  codes: [Code.schema]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
