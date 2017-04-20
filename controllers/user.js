var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session');
var User = require('../models/user.js');
var Code = require('../models/code.js');


router.post('/', function(req, res){
if((req.body.username.length>=4 && req.body.password.length>=8) && (req.body.password===req.body.password2)){
	req.body.password=bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	User.findOne({username: req.body.username}, function(err, foundUser){
		if(foundUser === null){
			req.session.username=true;
			req.session.password=true;
			User.create(req.body, function(err, createduser){
				req.session.currentuser = createduser;
				res.redirect('/');
			});
		}else{
			req.session.valid=false;
			res.redirect('/user/new');
		}
	});
}else if(req.body.username.length<4){
	req.session.username=false;
	res.redirect('/user/new');
}else if((req.body.password!==req.body.password2)||(req.body.password.length<8)){
	req.session.password=false;
	res.redirect('/user/new');
}
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
  res.render('user/new.ejs', {
		valid: req.session.valid,
		username: req.session.username,
		password: req.session.password
	});


});

router.get('/:id/edit', function(req, res){
	User.findById(req.params.id, function(err, founduser){
		res.render('user/edit.ejs', {
			user: founduser,
			valid: req.session.valid
		});
	});
});

router.put('/:id', function(req, res){
	if(req.body.password.length>=8 && (req.body.password === req.body.password2)){
	if(req.body.password===""){
		req.body.password=req.session.currentuser.password;
	}else{
	req.body.password=bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	}
	User.findOne({username: req.body.username}, function(err, foundUser){
		if(foundUser === null || foundUser.username===req.session.currentuser.username){
			User.findByIdAndUpdate(req.params.id, req.body, function(err, foundUser){
			User.findById(req.params.id, function(err, foundUpdatedUser){
				req.session.currentuser = foundUpdatedUser;
					res.render('user/show.ejs', {
						user: foundUpdatedUser,
						valid: req.session.valid=true

				});
			});
		});
		}else{
			res.render('user/edit.ejs', {
				user: req.session.currentuser,
				valid: req.session.valid=false
		});
		}
	});
}else{
	res.render('user/edit.ejs', {
		user: req.session.currentuser,
		valid: req.session.valid=false
	});
}
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
				req.session.destroy(function(){
		        res.redirect('/');
		    });
				}
		);
	});
});

module.exports = router;
