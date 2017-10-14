var mongojs = require('mongojs')
//var mongoose = require('mongoose')
var db = mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users','members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements'])

var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime')

module.exports.searchMemberWithdrawal = function(data, callback){
	db.withdrawals.find({
		member_id:data.id,
		date:{
			$gte:data.dateFrom,
			$lte:data.dateTo
		}
	}, callback)


}

module.exports.searchOfficerWithdrawal = function(data, callback){
	db.withdrawals.find({
		creditofficerid:data.id,
		date:{
			$gte:data.dateFrom,
			$lte:data.dateTo
		}
	}, callback)


}