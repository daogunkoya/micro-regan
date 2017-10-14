var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime');
dateOnly = dateFormat(now,'isoDate');
var Member = require('../models/member');
var Group = require('../models/group');
var Saving = require('../models/saving');
var Statement = require('../models/statement');
var Withdrawal = require('../models/withdrawal');
var Repayment = require('../models/repayment');
var Loan = require('../models/loan');
var Helper = require('../helper/formathelper');

//search member saving
router.post('/member/saving', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Saving.searchMemberSaving(data, function(err, savings){
		console.log('result saving='+ savings)
		Member.member(id, function(err, member){
				res.render('members/saving', {id:id,savings:savings,member:member,memberGroup:true})
		})
	})
})

//search Withdrawal
router.post('/member/withdrawal', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Withdrawal.searchMemberWithdrawal(data, function(err, withdrawal){
		console.log('result withdrawal='+ withdrawal)
		Member.member(id, function(err, member){
				res.render('members/withdrawal', {id:id,withdrawal:withdrawal,member:member,memberGroup:true})
		})
	})
})

//search Loan
router.post('/member/loan', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Loan.searchMemberLoan(data, function(err, loans){
		console.log('result loan='+ loans)
		Member.member(id, function(err, member){
				res.render('members/loan', {id:id,loans:loans,member:member,memberGroup:true})
		})
	})
})

//repayment
router.post('/member/repayment', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	loanid=req.body.loanid
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		loanid:loanid,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Repayment.searchMemberRepayment(data, function(err, repayment){
		console.log('result loan='+ repayment)
		Member.member(id, function(err, member){
				res.render('members/repayment', {id:id,repayment:repayment,loanid:loanid,member:member,memberGroup:true})
		})
	})
})

// //////////////////////////////////////////////////////////////////////////////////////////////////Search for Oficer Members //////////////////////////////////////////////////////////////
//search officer member saving
router.post('/officer/saving', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Saving.searchOfficerSaving(data, function(err, savings){
		console.log('result saving='+ savings)
		Member.member(id, function(err, member){
				res.render('officers/saving', {id:id,savings:savings,member:member,adminGroup:true})
		})
	})
})

//search officer member Statement
router.post('/officer/statement', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Statement.searchOfficerSaving(data, function(err, savings){
		console.log('result saving='+ savings)
		Member.member(id, function(err, member){
				res.render('officers/statement', {id:id,savings:savings,member:member,officerGroup:true})
		})
	})
})

//search officer Withdrawal
router.post('/officer/withdrawal', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Withdrawal.searchOfficerWithdrawal(data, function(err, withdrawal){
		console.log('result withdrawal='+ withdrawal)
		Member.member(id, function(err, member){
				res.render('officers/withdrawal', {id:id,withdrawal:withdrawal,member:member,adminGroup:true})
		})
	})
})

//officer search member Loan
router.post('/officer/loan', function(req,res,next){
	id = req.body.id
	option = req.body.option
	dateFrom=req.body.dateFrom
	dateTo=req.body.dateTo
	result = Helper.selectDate(option,dateFrom,dateTo)
	console.log("sent options"+result.dateFrom + " ," + result.dateTo)
//data
	data = {
		dateFrom:result.dateFrom,
		dateTo:result.dateTo,
		id:id
	}
	//today,1week,amonth,date
	option = req.body.option
	console.log(data)
	Loan.searchOfficerLoan(data, function(err, loans){
		console.log('result loan='+ loans)
		Member.member(id, function(err, member){
				res.render('officers/loan', {id:id,loans:loans,member:member,adminGroup:true})
		})
	})
})
module.exports = router