var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var port = process.env.PORT || 3000;
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/code';

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extened:false}));
app.use(session({
  secret:'secretWord',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));


var usersController = require('./controllers/user.js');
app.use('/user', usersController);

var sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);

app.get('/', function(req, res){
  console.log(req.session);
  res.render('index.ejs', {
    currentuser: req.session.currentuser
  });
});

app.get('/app', function(req, res){
  if(req.session.currentuser !== undefined){
    res.render('code/index.ejs');
  }else{
    res.redirect('/sessions/new');
  }
});

mongoose.connect(mongoDBURI);

mongoose.connection.once('open', function(){
  console.log('connected to mongo');
});

app.listen(port, function(){
  console.log('listening on port '+port);
});
