var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session');
var User = require('../models/user.js');
var Code = require('../models/code.js');


router.post('/', function(req, res){
	req.body.password=bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	User.findOne({username: req.body.username}, function(err, foundUser){
		if(foundUser === null){
			User.create(req.body, function(err, createduser){
				req.session.currentuser = createduser;
				res.redirect('/');
			});
		}else{
			res.redirect('/');
		}
	});
});


router.get('/', function(req, res){
	User.find({}, function(err, founduser){
		res.render('user/index.ejs', {
			user: founduser
		});
	});
});

router.get('/', function(req, res){
  res.render('user/index.ejs');
});

router.get('/new', function(req, res){
  res.render('user/new.ejs');
});

router.get('/:id/edit', function(req, res){
	User.findById(req.params.id, function(err, founduser){
		res.render('user/edit.ejs', {
			user: founduser
		});
	});
});

router.put('/:id', function(req, res){
	User.findByIdAndUpdate(req.params.id, req.body, function(){
		res.redirect('/user');
	});
});

router.get('/:id', function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		res.render('user/show.ejs', {
			user: foundUser
		});
	});
});


router.delete('/:id', function(req, res){
	User.findByIdAndRemove(req.params.id, function(err, foundUser){
		var codeIds = [];
		for(var i = 0; i< foundUser.codes.length; i++){
			codeIds.push(foundUser.codes[i]._id);
		}
		Code.remove(
			{
				_id:{
					$in: codeIds
				}
			},
			function(err, data){
				res.redirect('/user');
			}
		);
	});
});

module.exports = router;
