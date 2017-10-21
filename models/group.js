var mongojs = require('mongojs')

var bcrypt = require('bcryptjs');
var db = mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users','members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements'])

//count grouo
module.exports.countGroup = function(callback){
	db.groups.count(callback)
}

//count grouo
module.exports.countGroupByOfficerId = function(id,callback){
	db.groups.find({officerid:id}).count(callback)
}

module.exports.register = function(data,callback){
	db.groups.save(data)
}

module.exports.listGroups = function(callback){
	db.groups.find(callback)
}
module.exports.listGroupsByOfficer = function(id, callback){
	db.groups.find({officerid:id},callback)
}
module.exports.groupName = function(id,callback){
	db.groups.findOne({_id:mongojs.ObjectId(id)},callback)
}
//delete group
module.exports.delete = function(id,callback){
	db.groups.remove({_id:mongojs.ObjectId(id)}, callback)
}
//update member Group
module.exports.update = function(id,data,callback){
//find group id
	db.members.findAndModify({
		query:{_id:mongojs.ObjectId(id)},
			update:{$set: data},
				new:true,
			}, callback)
//update users model
	db.users.findAndModify({
		query:{_id:mongojs.ObjectId(id)},
		update:{$set: {email:data.email, type:data.type}},
		new:true,
	}, callback)
}

//group account on credit officer
module.exports.officerGroupAccount = function(id,callback){
			db.members.aggregate([
			{
				$match:{
					creditofficerid:id
				}
			},
			
			{
				$group: { 
					_id:'$groupid', 
					
					totalBalance: { 
						$sum: "$balance" 
					} ,
					totalLoan:{
						$sum:"$totalloan"
					},
					totalRepayment:{
						$sum:"$repayment"
					}
				} 
			} 
			], callback)

}

//total a Group
module.exports.singleGroupAccount = function(id,callback){
	console.log('got here')
			db.members.aggregate([

			{
				$match:{
					groupid:id
				}
			},
			{
				$group: { 
					_id:null, 
					totalBalance: { 
						$sum: "$balance" 
					} ,
					totalLoan:{
						$sum:"$totalloan"
					},
					totalRepayment:{
						$sum:"$repayment"
					}
				} 
			} 
			]
		 , callback)

}

//accounts on all group
module.exports.groupAccounts = function(callback){
			db.members.aggregate( 
			{
				$group: { 
					_id:'$groupid', 
					totalBalance: { 
						$sum: "$balance" 
					} ,
					totalLoan:{
						$sum:"$totalloan"
					},
					totalRepayment:{
						$sum:"$repayment"
					}
				} 
			} 
		 , callback)

}