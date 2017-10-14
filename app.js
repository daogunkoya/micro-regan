var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongojs = require('mongojs');
var mongoose = require('mongoose');
var dateTime = require('node-datetime');

server = require('http').createServer(express),
//mongoose.connect('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan')
//mongoose.connection
//var mongojsModel = require('mongojs-models')


mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users',,'members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements'])

var index = require('./routes/index');
var users = require('./routes/users');
var members = require('./routes/members');
var officers = require('./routes/officers');
var admin = require('./routes/admin');
var groups= require('./routes/groups');
var searchs= require('./routes/searchs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized  :true,
	resave: true
}));
//passport
app.use(passport.initialize())
app.use(passport.session());

//Express Validator

app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace = param.split("."),
		root = namespace.shift(),
		formParam = root	;

		while(namespace.length){
			formParam += '[' + namespace + ']';
		}

		return {
			param: formParam,
			msg : msg,
			value : value
		}
	}
}));
	//connect-flash
	app.use(flash());

	app.get('*', function(req,res,next){
		
			
		if(req.user){
				res.locals.user = req.user ||null;
		}
		

			next();
		
	})

//globar var
	app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	var dt = dateTime.create();
	res.locals.datetime = dt.format('Y-m-d H:M:S');
	
	next();
}); 
app.get('*', function(req,res,next){
	res.locals.user = req.user ||null
	if(req.user){
		
		type = req.user.type
		res.locals.type = type
		res.locals.id = req.user._id

		if(type =='Member'){
		res.locals.memberGroup = true
		res.locals.officerGroup = false
		res.locals.adminGroup = false
		}
		else{
			if(type =='Officer'){
				res.locals.memberGroup = false
				res.locals.officerGroup = true
				res.locals.adminGroup = false
			}
			else{
				res.locals.memberGroup = false
				res.locals.officerGroup = false
				res.locals.adminGroup = true
				res.locals.controller = true
			}
		}
	}
	
	
	next();
})

app.use('/', index);
app.use('/users', users);
app.use('/members', members);
app.use('/officers', officers);
app.use('/admin', admin);
app.use('/groups', groups);
app.use('/searchs', searchs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
//server.listen(process.env.PORT || 3000);