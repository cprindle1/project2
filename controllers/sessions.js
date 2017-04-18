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
          console.log("FOUND CODE: "+req.session.code);
        req.session.currentuser = foundUser;
        res.redirect('/');
      });

      }else{
        res.send('wrong password');
    }
  }else{
    res.send('invalid username');
  }
  });
});

router.delete('/', function(req, res){
    req.session.destroy(function(){
        res.redirect('/');
    });
});

module.exports = router;
