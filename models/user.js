var mongojs = require('mongojs')
var bcrypt = require('bcryptjs');
var db = mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users','members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements','logs'])
module.exports.register = function(user){
	bcrypt.hash(user.password,10, function(err, hash){
		if (err) throw err
		user.password = hash;
	console.log('new user is now being saved')
		db.users.save(user)
		db.members.save(user)
	})
}

//get user by username
module.exports.getUserByUsername = function(username,callback){
	db.users.findOne({username:username}, callback)
}


//get single user
module.exports.getUserById = function(id, callback){
		db.users.findOne({_id:mongojs.ObjectId(id)}, callback)
}

// get user by email
module.exports.getUserByEmail = function(email,callback){
db.getUserByUsername.findOne({email:email},callback)
}

//compare password

module.exports. comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw error
			callback(null, isMatch)
	})
}

module.exports.logInfo = function(data){
	db.logs.save(data)
}







