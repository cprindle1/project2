var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var Code = require('./models/code.js');

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

var codeController = require('./controllers/code.js');
app.use('/code', codeController);

var sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);

app.get('/', function(req, res){
  if(req.session.valid===undefined){
    req.session.valid=true;
  }
  Code.find({public: true}, function(error, foundCode){
    res.render('index.ejs', {
      currentuser: req.session.currentuser,
      code: foundCode,
      valid: req.session.valid
    });
  });
});

app.post("/search", function(req, res) {
  console.log("QUERY: " + req.body.query);
  Code.find(
    { $text : { $search : req.body.query } },
    { score : { $meta: "textScore" } }
  )
  .sort({ score : { $meta : 'textScore' } })
  .exec(function(err, results) {
    console.log(results);
    res.render('index.ejs', {
      currentuser: req.session.currentuser,
      code: results
    });
  });
});

app.get('/:tag', function(req, res){
  Code.find({tags: {$elemMatch: {$eq: req.params.tag}}}, function(error, foundCode){
    console.log("HITTING HERE");
    res.render('index.ejs', {
      currentuser: req.session.currentuser,
      code: foundCode
    });
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
