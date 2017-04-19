var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Code = require('../models/code.js');
var bcrypt = require('bcrypt');
var session = require('express-session');

router.get('/new', function(req, res){
  res.render('sessions/new.ejs');
});

router.post('/', function(req, res){
  User.findOne({username: req.body.username}, function(err, foundUser){
    if(foundUser !== null){
      if(bcrypt.compareSync(req.body.password, foundUser.password)){
        Code.find({}, function(err, foundCode){
          req.session.code=foundCode;
          req.session.currentuser = foundUser;
          req.session.valid=true;
          res.redirect('/');
      });
      }else{
        req.session.valid=false;
        res.redirect('/');
      }
  }else{
    req.session.valid=false;
    res.redirect('/');
  }
  });
});

router.delete('/', function(req, res){
    req.session.destroy(function(){
        res.redirect('/');
    });
});

module.exports = router;
