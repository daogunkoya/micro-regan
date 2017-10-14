var mongojs = require('mongojs')
//var mongoose = require('mongoose')
var db = mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users','members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements'])

var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime')

//count grouo
module.exports.countLoans = function(callback){
	db.loans.count(callback)
}

module.exports.searchMemberLoan = function(data, callback){
	db.loans.find({
		member_id:data.id,
		date:{
			$gte:data.dateFrom,
			$lte:data.dateTo
		}
	}, callback)


}

module.exports.searchOfficerLoan = function(data, callback){
	db.loans.find({
		creditofficerid:data.id,
		date:{
			$gte:data.dateFrom,
			$lte:data.dateTo
		}
	}, callback)


}