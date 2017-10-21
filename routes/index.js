var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime');
dateOnly = dateFormat(now,'isoDate');
var Member = require('../models/member');
var Loan = require('../models/loan');
var Repayment = require('../models/repayment');
var Statement = require('../models/statement');
var Group = require('../models/group');
var UserModel = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/dashboard', function(req,res,next){
	logData = {
		username:req.user.username,
		fname:req.user.fname,
		lname:req.user.lname,
		member_id:req.user._id,
		type:req.user.type,
		operation:'success',
		date:dateNow
	}

	UserModel.logInfo(logData)

    var id = (req.user)?req.user._id:'unavailable';
	var type = (req.user.type == 'Member')?'Member':((req.user.type == 'Officer')?'Officer':'Admin')
	console.log('type='+type)
	type = String(type)

	id = String(id)	
	console.log('id='+ id)
						console.log('id in string = '+ id)	
						if(type == 'Member'){					//member accounts
							res.redirect('/dashboard/members')
						}
						else{
								if(type=='Officer'){              //render for officer
										res.redirect('/dashboard/officers')
								}
								else{
									res.redirect('/dashboard/admin')
								}
						}
})

//Member route
router.get('/dashboard/members', function(req,res,next){
	var id = (req.user)?req.user._id:'unavailable';
	id = String(id)	
	console.log('id='+ id)
		Member.countMember(function(err, members){
			Member.countCreditOfficer(function(err, officers){
				console.log('members'+members + 'officers= ' + officers  )
				Group.countGroup(function(err,groups){
					console.log('id in string = '+ id)	
					Member.member(id,function(err, user){		//member details
										//member accounts
							Member.lastWithdrawal(id,function(err,withdrawal){
								user.totalWithdrawal = withdrawal.amount== null || 0 ? 0:withdrawal.amount
								res.render('members/index', {tMembers:members,tOfficers:officers,tGroups:groups,user:user})
							})
					})
				})
			})
				
		})
})

//officer route

router.get('/dashboard/officers', function(req,res,next){
	var id = (req.user)?req.user._id:'unavailable';
	var type = (req.user.type == 'Member')?'Member':((req.user.type == 'Officer')?'Officer':'Admin')
	console.log('type='+type)
	type = String(type)

	id = String(id)	
	console.log('id='+ id)
				Group.countGroupByOfficerId(id, function(err,groupsCount){
					Loan.officerMemberLoan(id, function(err, loanlist){
						Repayment.officerMemberRepayment(id, function(err, repaymentList){
							Statement.officerMemberStatement(id, function(err,statementList){

						console.log('groups = '+ groupsCount)	
					Member.member(id,function(err, user){		//member details
                    	Member.officerSaving(id, function(err, accounts){	//officer account
                    	//balance to pay	
                    		accounts[0].balance = parseFloat(accounts[0].totalLoan) -(parseFloat(accounts[0].totalRepayment) + parseFloat(accounts[0].totalBalance)	)
							    	Member.officerAccountInfo(id, function(err,counts){
										user.officerMembers = counts	
										user.groupsCount= groupsCount
										user.loanList= loanlist
										user.repaymentList= repaymentList
										user.statementList = statementList
														//officer members
									console.log('account='+ accounts[0].totalBalance)
									res.render('members/index', {user:user,accounts:accounts[0]})
								})
							})
							})
						})
					})
					})
				})
	
})

//Admin route

router.get('/dashboard/admin', function(req,res,next){
	var id = (req.user)?req.user._id:'unavailable';
	var type = (req.user.type == 'Member')?'Member':((req.user.type == 'Officer')?'Officer':'Admin')
	console.log('type='+type)
	type = String(type)

	id = String(id)	
	console.log('id='+ id)
		Member.countMember(function(err, members){
			Member.countCreditOfficer(function(err, officers){
				console.log('members='+members + ',officers= ' + officers  )
				Group.countGroup(function(err,groups){
					console.log('id in string = '+ id)	
					Member.member(id,function(err, user){		//member details
                    Member.accounts(function(err, accounts){	//officer account
               //balance to pay	
                    		accounts[0].totalBalance = parseFloat(accounts[0].totalLoan) -parseFloat(accounts[0].totalRepayment)					//
									console.log('account='+ accounts[0].totalBalance)
									res.render('admin/index', {tMembers:members,tOfficers:officers,tGroups:groups,user:user,accounts:accounts[0]})
							})
						
					})
				})
			})
				
		})
})

module.exports = router;
