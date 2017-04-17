var express = require('express');
var router = express.Router();
var Code = require('../models/code.js');
var User = require('../models/user.js');
var session = require('express-session');

router.get('/', function(req, res){
	Code.find({}, function(err, foundcode){
		res.render('code/index.ejs', {
			code: foundcode
		});
	});
});

router.get('/new', function(req, res){
	User.find({}, function(err, foundUser){
		res.render('code/new.ejs',{
			user: foundUser
		});
	});
});

router.post('/', function(req, res){
	User.findById(req.body.userId, function(err, foundUser){
		Code.create(req.body, function(err, createdCode){
			foundUser.codes.push(createdCode);
			foundUser.save(function(err, savedUser){
				res.redirect('/code');
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
	Code.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedCode){
		User.findOne({'codes._id': req.params.id}, function(err, foundUser){
			if(foundUser._id.toString() !== req.body.userId){
				foundUser.codes.id(req.params.id).remove();
				foundUser.save(function(err, savedFoundUser){
					User.findById(req.body.userId, function(err, newUser){
						newUser.codes.push(updatedCode);
						newUser.save(function(err, savedNewUser){
							res.redirect('/code/'+req.params.id);
						});
					});
				});
			}else{
				foundUser.codes.id(req.params.id).remove();
				foundUser.codes.push(updatedCode);
				foundUser.save(function(err, data){
					res.redirect('/code/'+req.params.id);
				});
			}
		});
	});
});

router.delete('/:id', function(req, res){
	Codes.findByIdAndRemove(req.params.id, function(err, foundCodes){
		User.findOne({'codes._id':req.params.id}, function(err, foundUser){
			foundUser.codes.id(req.params.id).remove();
			foundUser.save(function(err, data){
				res.redirect('/codes');
			});
		});
	});
});

router.get('/:id', function(req, res){
	Code.findById(req.params.id, function(err, foundCode){
		User.findOne({'codes._id':req.params.id}, function(err, foundUser){
			console.log(foundUser);

			res.render('code/show.ejs', {
				user: foundUser,
				code: foundCode
			});
		});
	});
});

module.exports = router;
