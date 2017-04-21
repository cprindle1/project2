var express = require('express');
var router = express.Router();
var Code = require('../models/code.js');
var User = require('../models/user.js');
var session = require('express-session');
var newCodes = require('../models/populateCode.js');
var userRouts = require('../controllers/user.js');

router.get('/', function(req, res){
	console.log("Figures");
	Code.find({}, function(err, foundcode){
		res.render('code/index.ejs', {
			code: foundcode
		});
	});
});

router.get('/new', function(req, res){
	if(req.session.currentuser !== undefined){
		res.render('code/new.ejs',{
			user: req.session.currentuser
		});
	}else{
		res.redirect('/user/new');
	}
	});

router.post('/', function(req, res){
	if(req.body.public === 'on'){
		req.body.public = true;
	}else{
		req.body.public = false;
	}
	req.body.tags=req.body.tags.toLowerCase();
	req.body.tags=req.body.tags.split(" ");
	User.findById(req.session.currentuser._id, function(err, foundUser){
		Code.create(req.body, function(err, createdCode){
			createdCode.userID=req.session.currentuser._id;
			createdCode.save(function(err, savedCode){
			foundUser.codes.push(createdCode);
			foundUser.save(function(err, savedUser){
				res.redirect('/user/'+foundUser._id);
				});
		});
	});
});
});

router.get('/:id/edit', function(req, res){
	Code.findById(req.params.id, function(err, foundCode){
		User.find({}, function(err, allUsers){
			User.findOne({'codes._id':req.params.id}, function(err, foundCodeUser){
				res.render('code/edit.ejs', {
					code: foundCode,
					users: allUsers,
					codeUser: foundCodeUser
				});
			});
		});
	});
});

router.put('/:id', function(req, res){
	if(req.body.public === 'on'){
		req.body.public = true;
	}else{
		req.body.public = false;
	}
	req.body.tags=req.body.tags.toLowerCase();
	req.body.tags=req.body.tags.split(" ");
	Code.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedCode){
		User.findOne({'codes._id': req.params.id}, function(err, foundUser){
				foundUser.codes.id(req.params.id).remove();
				foundUser.codes.push(updatedCode);
				foundUser.save(function(err, data){
					res.redirect('/user/'+foundUser._id);
				});
			});
		});
	});

router.delete('/:id', function(req, res){
	Code.findByIdAndRemove(req.params.id, function(err, foundCodes){
		User.findOne({'codes._id':req.params.id}, function(err, foundUser){
			foundUser.codes.id(req.params.id).remove();
			foundUser.save(function(err, data){
				res.redirect('/user/'+req.session.currentuser._id);
			});
		});
	});
});

router.get('/:id', function(req, res){
	Code.findById(req.params.id, function(err, foundCode){
			res.render('code/show.ejs', {
				user: req.session.currentuser,
				code: foundCode
		});
	});
});

module.exports = router;
