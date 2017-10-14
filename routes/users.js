var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var passport = require('passport');
var dateFormat = require('dateformat');
var dateTime = require('node-datetime');
var dateNow = dateFormat(now,'isoDateTime');
dateOnly = dateFormat(now,'isoDate');
var LocalStrategy = require('passport-local').Strategy;
// require models
	var UserModel = require('../models/user');
	var Member = require('../models/member');
	var Group = require('../models/group');
	var now = new Date();



//register new user
router.get('/register', function(req,res,next){
	
	Group.listGroups(function(err, groups){
			if(err) throw err
		Member.findCreditOfficer(function(err,creditofficer){
				data = {
			group:groups,
			creditofficer:creditofficer
			}
			res.render('members/register',{data:data})
		})
		
		})
})

router.post('/register', function(req,res,next){
	
	var listName = []
	var username = req.body.username;
	var name = req.body.username;
	var listName = name.split(" ")
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var password = req.body.password
	var password2 = req.body.password2
	var creditofficerid = req.body.officer
	var groupid = req.body.group
	var datetime = dateFormat(now,"isoDateTime")

	var user = {
		username: username,
		fname:fname,
		lname:lname,
		email: email,
		creditofficerid:creditofficerid,
		groupid:groupid,
		password:password,
		type:'Member',
		created_at:datetime,
	}

	console.log(req.body.username, req.body.email);

	req.checkBody('username', 'Username can not be Empty').notEmpty();
	req.checkBody('fname', 'First Name can not be Empty').notEmpty();
	req.checkBody('lname', 'Last Name can not be Empty').notEmpty();
	req.checkBody('email', 'Email must be a valid email Address').isEmail();
	req.checkBody('password2', 'Password do not match').equals(req.body.password);
	
	errors = req.validationErrors();

	if(errors){
		//res.render('members/register', {errors:errors})

		Group.listGroups(function(err, groups){
			if(err) throw err
		Member.findCreditOfficer(function(err,creditofficer){
				data = {
			group:groups,
			creditofficer:creditofficer
			}
			res.render('members/register',{data:data,errors:errors})
		})
		
		})
	}

	else {
		//User.save(user);
		UserModel.register(user);
		res.redirect('/')
		
	}
	
})

router.get('/login', function(req,res,next){
	res.render('login');
})

passport.serializeUser(function(user, done) {
  done(null, user._id);
});


passport.deserializeUser(function(id, done) {
  UserModel.getUserById(id, function (err, user) {
    done(err, user);
  });
});



//user post login

router.post('/login', passport.authenticate('local', {failureRedirect:'/', failureFlash:true}), function(req,res,next){
	req.flash('success_msg', 'You now logged in');
	//var usertype = req.user.type;
	res.redirect('/dashboard');
	});
	passport.use(new LocalStrategy(

			function(username, password, done){
				UserModel.getUserByUsername(username, function(err, user){
					if(err) throw err
					
					if(!user){
						return done(null, false, {message: 'unknown user ' + username})
					}

					UserModel.comparePassword(password,user.password, function(err, isMatch ){
						if(err) throw err;

						if(isMatch){
							return done(null,user);

						} else {
							console.log('invalid password')
							return done(null, false, {message : 'Invalid Password'});
						}
					})


				})

			}
		));


//logout
router.get('/logout', function(req,res){
	req.logout()
	req.flash('success_msg', "Successfully Logged out")
	res.redirect('/')
})
module.exports = router;
