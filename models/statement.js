var mongojs = require('mongojs')
//var mongoose = require('mongoose')
var db = mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users','members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements','expenses'])

module.exports.Transaction = function(data,callback){
	db.statements.find({$and:
		[{member_id:data.member_id},{date:data.date}]
		}).sort({_id:-1}).limit(1,function(err,result){
			console.log('result value')
			console.log(result)
			if (result.length == 0){
//save new transaction
				db.statements.save(data)
			}
			else{
				
				lastBalance = result[0].balance
//new balance for depost/wihdrwal
				data.balance = data.type == 'deposit'?parseFloat(lastBalance) + parseFloat(data.amount):parseFloat(lastBalance) - parseFloat(data.amount)
				console.log('final balance = '+ lastBalance)
//save new transaction
				db.statements.save(data)
				db.statements.find({$and:
			[{member_id:data.member_id},{date:data.date}]
			}).sort({_id:-1}).limit(1,callback)
			}
		})
}
module.exports.getMemberTransaction = function(id,callback){
	db.statements.find({member_id:id},callback)
}

module.exports.getOfficerTransaction = function(id,callback){
	db.statements.find({creditofficerid:id},callback)
}
module.exports.numberList = function(data){
	for(i=0;i<data.length;i++){
		data[i].no = i + 1
	}
	return data
}

module.exports.searchOfficerSaving = function(data, callback){
	db.statements.find({
		creditofficerid:data.id,
		date:{
			$gte:data.dateFrom,
			$lte:data.dateTo
		}
	}, callback)

}