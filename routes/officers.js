var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime');
dateOnly = dateFormat(now,'isoDate');
var Member = require('../models/member');
var Group = require('../models/group');
var Statement = require('../models/statement');

//check if user is logged in
router.get('*', function(req,res,next){
	if(req.user == null){
		res.redirect('/users/login')
	}
	next();
})

// users home page
router.get('/', function(req,res,next){
	var user = (req.user)?req.user.username:'unavailable';
		Member.countMember(function(err, members){
			Member.countCreditOfficer(function(err, officers){
				console.log('members'+members + 'officers= ' + officers  )
				Group.countGroup(function(err,groups){
					res.render('members/index', {username:user,tMembers:members,tOfficers:officers,tGroups:groups})
				})
			})
				
		})
			
})


//officer members
router.get('/:id/memberslist', function(req,res,next){
	id2 = req.params.id
	mymembers= []
	console.log('officerid='+id2)
	if(req.user.type !== null){
			Member.officerMembers(id2, function(err,members){
				members = Statement.numberList(members)
				Member.officerSaving(id2, function(err, accounts){
						console.log('accounts='+ accounts)
						console.log('members'+ members)
				
				if(err) throw err
				res.render('officers/memberslist', {members:members,accounts:accounts[0]})
					})
				})
		}
	else {
		res.render('/users/logout')
	}
	

})

router.post('/edit', function(req,res,next){

		title = req.body.title;
		fname = req.body.fname;
		lname = req.body.lname;
		email = req.body.email;
		address = req.body.address;
		phone = req.body.phone;
		group = req.body.group;
		type = req.body.type;
		creditofficer = req.body.creditofficer;
		username = req.user.username
		var data = {
			title:title,
			fname:(fname).toLowerCase(),
			lname:(lname).toLowerCase(),
			email:email,
			address:address,
			phone:phone,
			groupid: group,
			type: type,
			creditofficerid:creditofficer,
			updated_at:dateFormat(now,'isoDateTime')
		}
		console.log(data)
		Member.update(username,data,function(err, data){
			if(err) throw err	
		})

		res.redirect('/members')
})

//Member Deposite

router.get('/:id/statements', function(req,res,next){
	var id = req.params.id
	//find member
	
	Statement.getOfficerTransaction(id, function(err, savings){
		savings = Statement.numberList(savings)
		if(err) throw err
			console.log(savings)
		Member.member(id, function(err, member){
			Member.officerSaving(id, function(err,accounts)
			{
				res.render('officers/statement', {id:id,savings:savings,member:member,officer:accounts[0]})
			})
				
		})
	})
		
})



router.get('/:id/withdrawal', function(req,res,next){
	var id = req.params.id
	//find member
	
	Member.getOfficerMemberWithdrawal(id, function(err, withdrawal){
		if(err) throw err
			console.log(withdrawal)
		Member.member(id, function(err, member){
				res.render('officers/withdrawal', {id:id,withdrawal:withdrawal,member:member})
		})
	})
		
})

//Loans

router.get('/:id/loan', function(req,res,next){
	var id = req.params.id
	//find member
	
	Member.getOfficerMemberLoans(id, function(err, loans){
		if(err) throw err
			console.log(loans)
		loans = Statement.numberList(loans)
	//for officer info
		Member.member(id, function(err, member){
				res.render('officers/loan', {id:id,loans:loans,member:member})
		})
	})
		
})


//delete loan
router.delete('/loan/delete', function(req,res,next){
	var id = req.body.id
	Member.loanDelete(id, function(err,data){
		if(err) throw err
			res.json({status:200})
	});

})
//loan confirm
router.post('/loan/confirm', function(req,res){
	id = req.body.id
	value = req.body.value
	console.log('main server id='+id)
	Member.confirmLoan(id,value,function(err,data){
		if(err) throw err;
		res.json({status:200})
	})
})

//repayment get
router.get('/:id/repayment/:loanid', function(req,res,next){
	var id = req.params.id
	var loanid = req.params.loanid
	//find member
	
	Member.getMemberRepayment(loanid, function(err, repayment){
		if(err) throw err
			console.log(repayment)
		repayment = Statement.numberList(repayment)
		Member.member(id, function(err, member){
				res.render('members/repayment', {id:id,repayment:repayment,member:member,loanid:loanid})
		})
	})

})



//delete repayment

router.delete('/repayment/delete', function(req,res,next){
	id = req.body.id
	data ={
		id:id,
		updated_at:dateOnly
	}
	Member.deleteRepayment(data, function(err,data){
		if(err) throw err
		res.json({status:200})
	})

})
//confirm repayment
router.post('/repayment/confirm', function(req,res,next){
	id = req.body.id
	console.log('id='+id)
	data ={
		id:id,
		updated_at:dateOnly
	}
	Member.confirmRepayment(data, function(err,data){
		if(err) throw err
		res.json({status:200})
	})

})

//Finished repayment
router.post('/repayment/finished', function(req,res,next){
	memberid = req.body.memberid
	loanid = req.body.loanid
	loan = req.body.loan
	status = req.body.status
	
	data ={
		loanid:loanid,
		loan:loan,
		memberid:memberid,
		status:status,
		updated_at:dateOnly
	}
	console.log(data)
	Member.finishRepayment(data, function(err,data){
		if(err) throw err
	})
	res.json({status:200})
})
//new search for front end display
router.post('/searchmember', function(req,res,next){
	var name = req.body.term
	console.log('item sent'+ name)
	Member.searchMember(name, function(err,member){
		list = []
		console.log("list=:"+member)
		for(i=0;i<member.length;i++){
			list[i] = member[i].fname + " " + member[i].lname
		}
		console.log("Items Are:"+list)
		res.json(list)
	})
})
//show result of search memeber
router.get('/searchmember/:name', function(req,res,next){
	var name = req.params.name
	nameList = name.split(" ")
    var fname = nameList[0]
     var lname = nameList[1]
     Member.searchAMember(fname,lname, function(err,members){
     		if(err) throw err
		res.render('members/memberslist', {members:members})
     })
	console.log(name)
	
})
//expenses
router.get('/:id/expenses', function(req,res,next){
		id =req.params.id
		console.log('id='+id)
	Member.listExpensesByOfficer(id,function(err,expenses){
		Member.member(id, function(err, member){
			console.log('expenses ='+ expenses)
			res.render('officers/expenses',{expenses:expenses,member:member})
		})
	})
		
})

router.post('/expenses', function(req,res,next){
	//id = req.user._id
	id = req.body.id
	fname = req.body.fname
	lname = req.body.lname
	officerName = fname + " " + lname
	name = req.body.name
	description = req.body.description
	total = req.body.total
	date = req.body.date

	req.checkBody('name','Name is Required').notEmpty()
	req.checkBody('description','Description is Required').notEmpty()
	req.checkBody('date','Date is Required').notEmpty()
	req.checkBody('total','Total is Required').notEmpty()


	var errors = req.validationErrors();
	if(errors){
		res.render('officers/expenses', {errors:errors,id:id})
	}
	else{
		data = {
				name:officerName,
				expensename:name,
				description:description,
				total:total,
				officerid:id,
				date:date
			}
			console.log('data='+data)
			Member.expense(data);
			res.redirect('/dashboard/')
	}

			
})
//officer payment to admin
router.get('/:id/mypayment', function(req,res,next){
		id =req.params.id
		console.log('id='+id)
	Member.listPaymentByOfficer(id,function(err,payments){
		Member.lastPaymentByOfficer(id,function(err,lastPayments){
			balance = lastPayments.length == 0?0:lastPayments[0].balance
			payments = Statement.numberList(payments)
			Member.member(id, function(err, member){
				Member.officerSaving(id, function(err, accounts){
						if(err) throw err
						console.log('payments ='+ payments)
					console.log(accounts[0])
						res.render('officers/mypayments',{payments:payments,member:member,
							accounts:accounts[0],lastPayment:balance})
					})
				})
		})
	})
		
})



router.post('/payment', function(req,res,next){
	id = req.body.id
	fname = req.body.fname
	lname = req.body.lname
	officerName = fname + " " + lname
	amount = req.body.amount
	type = req.body.type

	lastPayments = parseFloat(req.body.lastPayment)
	saving = req.body.totalBalance
	repayment = req.body.totalRepayment
	loan = req.body.totalLoan
	console.log('last payment='+ lastPayments)
	
//check if balance need to be paid else reset
	newBalance = (parseFloat(saving) + parseFloat(repayment)) -parseFloat(amount)
	existingBalance = parseFloat(lastPayments) -parseFloat(amount)
	balance = (lastPayments == 0 || null)?newBalance:existingBalance
	
	req.checkBody('amount','Amount is Required').notEmpty()
	
	var errors = req.validationErrors();
	if(errors){
		res.render('officers/expenses', {errors:errors,id:id})
	}
	else{
		data = {
				officer_id:id,
				officer:officerName,
				paid:amount,
				balance:balance,
				saving:saving,
				repayment:repayment,
				loan:loan,
				type:type,
				created_at:dateNow,
				date:dateOnly
			}
			console.log('data='+data)
			Member.officerAddPayment(data);
			res.redirect('/dashboard/')
	}
	
})

 /*name = ui.item.value
         */
module.exports = router