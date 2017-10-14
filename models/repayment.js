var mongojs = require('mongojs')
//var mongoose = require('mongoose')
var db = mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users','members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements'])

var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime')

//count grouo
module.exports.countRepayment = function(callback){
	db.repayments.count(callback)
}

//search repaymentsearchMemberRepayment
module.exports.searchMemberRepayment = function(data, callback){
	db.repayments.find({
		member_id:data.id,
		loanid:data.loanid,
		date:{
			$gte:data.dateFrom,
			$lte:data.dateTo
		}
	}, callback)


}