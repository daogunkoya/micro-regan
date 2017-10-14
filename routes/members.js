var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime');
dateOnly = dateFormat(now,'isoDate');
var Member = require('../models/member');
var Statement = require('../models/statement');
var Group = require('../models/group');

//check if user is logged in
router.get('*', function(req,res,next){
	if(req.user == null){
		res.redirect('/users/login')
	}
	next();
})
// users home page
router.get('/', function(req,res,next){
	
			
})


//List exisitng members
router.get('/list', function(req,res,next){

	if(req.user.type !== null){
			Member.membersList(function(err,members){
				if(err) throw err
				res.render('members/memberslist', {members:members})
					})
		}
	else {
		res.render('/users/logout')
	}
	

})

//Edit members info
router.get('/edit', function(req,res,next){
	var username = req.user.username

	Member.getMemberByUsername(username,function(err, member){
		if(err) throw err
		Group.listGroups(function(err, groups){
			if(err) throw err
		creditofficer = Member.findCreditOfficer(function(err,creditofficer){
				data = {
			member:member,
			group:groups,
			creditofficer:creditofficer
			}
		res.render('members/edit',{data:data})


		})
		
		})
	})
	

})
//delete member
router.delete('/deletemember', function(req,res){
	id = req.body.id
	Member.deleteMember(id, function(err,info){
		if(err) throw err
			res.json({status:200})
	})
})
//edit for a memeber
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

		res.redirect('/dashboard')
})

//Member Deposite

router.get('/:id/saving', function(req,res,next){
	var id = req.params.id
	//find member
	
	Statement.getMemberTransaction(id, function(err, savings){
		if(err) throw err
			savings = Statement.numberList(savings)
			//console.log(savings)
		Member.member(id, function(err, member){
				res.render('members/saving', {id:id,savings:savings,member:member})
		})
	})
		
})

//member new Saving
router.post('/newsaving', function(req,res,next){
	var id = req.body.id
	var amount = req.body.amount
	var name = req.body.name 
	var groupid = req.body.groupid 
	var creditofficerid = req.body.creditofficerid
	var dt = dateTime.create();
	var datetime = dt.format('Y-m-d H:M:S');
	var data = {
		type : 'deposit',
		member_id: id,
		name:name,
		amount: amount,
		Deposit: amount,
		Withdraw: '-',
		balance: 0,
		groupid:groupid,
		creditofficerid:creditofficerid,
		created_at:dateNow,
		date:dateOnly
	}
	req.checkBody('amount', 'Please Enter an Amount').notEmpty();
	var errors = req.validationErrors();
	//console.log("date="+ datetime.getDate())
	if(errors){
		res.render('members/saving', {errors:errors,id:id})
	}
	else{
			Member.member(id, function(err,member){
				Group.groupName(groupid, function(err,group){
					data.groupname = group.name
					member.balance= member.balance==null?0:member.balance
					data.balance = parseFloat(member.balance) + parseFloat(amount)
				Member.newSaving(data);						//new saving
				Member.updateMemberBalance(id,data.balance,function(err,result){
					if(err) throw err
					Statement.Transaction(data, function(err,statement){
						if(err) throw err
							console.log("value=")
							console.log(statement[0])
					})
				})
				})
					
			})	
		res.redirect('/members/' + id+'/saving')
	}
	
	console.log(data)
	//res.render('members/saving', {id:id})
})


//member new Withdrawal
router.post('/newWithdrawal', function(req,res,next){
	var id = req.body.id
	var name = req.body.name 
	var amount = req.body.amount
	var groupid = req.body.groupid 
	var creditofficerid = req.body.creditofficerid
	var dt = dateTime.create();
	var datetime = dt.format('Y-m-d 	 H:M:S');
	var data = {
		type : 'withdraw',
		member_id: id,
		name:name,
		amount: amount,
		Deposit: '-',
		Withdraw:amount,
		balance: 0,
		groupid:groupid,
		creditofficerid:creditofficerid,
		created_at:dateNow,
		date:dateOnly
	}
	req.checkBody('amount', 'Please Enter an Amount').notEmpty();
	var errors = req.validationErrors();
	
	if(errors){
		res.render('members/withdrawal', {errors:errors,id:id})
	}
	else{
//submit to db
				Member.member(id, function(err,member){
				Group.groupName(groupid, function(err,group){
					data.groupname = group.name
						console.log("balance="+member.balance)
					member.balance= parseFloat(member.balance)==null?0:member.balance
					data.balance = parseFloat(member.balance) - parseFloat(amount)
					Member.newWithdrawal(data);
					Member.updateMemberBalance(id,data.balance,function(err,result){
						if(err) throw err
					Statement.Transaction(data, function(err,statement){
						if(err) throw err
							console.log("value=")
							console.log(statement[0])
					})

					})
				})
			})	
		res.redirect('/members/' + id + '/withdrawal')
	}
	
	console.log(data)
	//res.render('members/saving', {id:id})
})
//Withdraws

router.get('/:id/withdrawal', function(req,res,next){
	var id = req.params.id
	//find member
	
	Statement.getMemberTransaction(id, function(err, withdrawal){
		if(err) throw err
			console.log(withdrawal)
		withdrawal = Statement.numberList(withdrawal)
		Member.member(id, function(err, member){
				res.render('members/withdrawal', {id:id,withdrawal:withdrawal,member:member})
		})
	})
		
})

//Loans

router.get('/:id/loan', function(req,res,next){
	var id = req.params.id
	//find member
	
	Member.getMemberLoans(id, function(err, loans){
		if(err) throw err
			console.log(loans)
		loans = Statement.numberList(loans)
		Member.member(id, function(err, member){
			member.loanStatus = (member.loan == "" || member.loan == null || parseFloat(member.loan <= 0))?true:false
			console.log('loan value'+ member.loan)
				res.render('members/loan', {id:id,loans:loans,member:member})
		})
	})
		
})

//new loan
router.post('/newLoan', function(req,res,next){
	var id = req.body.id
	var name = req.body.name 
	var groupid = req.body.groupid 
	var balance = req.body.balance 
	var creditofficerid = req.body.creditofficerid
	var amount = req.body.amount
	var interest = (0.15 * parseFloat(amount))  
	var charge = (0.10 * parseFloat(interest)) //service charge is 10% of interest
	var total = parseFloat(amount) + parseFloat(interest)
	var dt = dateTime.create();
	var datetime = dt.format('Y-m-d H:M:S');
	var data = {
		member_id: id,
		name:name,
		amount: parseFloat(amount),
		deposit:balance,
		charges:charge ,
		totalrepayment:total,
		interest:interest,
		repaid:0,
		displayrepayment:true,
		completed:0,
		groupid:groupid,
		creditofficerid:creditofficerid,
		status:'Pending',
		stage:'onGoing',
		created_at:dateNow,
		date:dateOnly
	}
	req.checkBody('amount', 'Please Enter an Amount').notEmpty();
	var errors = req.validationErrors();
	
	if(errors){
		res.render('/members/loan', {errors:errors,id:id})
	}
	else{
			Group.groupName(groupid, function(err,group){
					data.groupname = group.name
				Member.newLoan(data, function(err,loan){
					res.redirect('/members/' + id + '/loan')
				})
			})
					
	}

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
	
	Member.getMemberRepayment(loanid, function(err, repaymentHistory){
		if(err) throw err
			repaymentHistory = Statement.numberList(repaymentHistory)
			//console.log(repaymentHistory)
		Member.member(id, function(err, member){
				res.render('members/repayment', {id:id,repaymentHistory:repaymentHistory,member:member,loanid:loanid})
		})
	})

})

//new Reapymeny
router.post('/repayment', function(req,res,next){
	var id = req.body.id
	var name = req.body.name 
	var groupid = req.body.groupid 
	var creditofficerid = req.body.creditofficerid
	var loanid = req.body.loanid
	var loan = req.body.loan
	var repayment = req.body.repayment
	var sc = req.body.sc
	var interest = req.body.interest					//service charge
	var amount = req.body.amount

	var newPayment = parseFloat(repayment) + parseFloat(amount)				//old paymet + new payment
	var totalRepayment = parseFloat(loan) + parseFloat(interest)			//total repayment
	var balanceToPay = parseFloat(totalRepayment) - parseFloat(newPayment)					//final balance
	var dt = dateTime.create();
	var datetime = dt.format('Y-m-d H:M:S');
	var data = {
		member_id: id,
		name:name,
		loanid:loanid,
		groupid:groupid,
		creditofficerid:creditofficerid,
		amount:parseFloat(amount),
		stage:'onGoing',
		repayment:newPayment,
		loan:parseFloat(loan),
		balance:balanceToPay,
		totalrepayment:totalRepayment,
		created_at:datetime,
		date:dateOnly
	}
	req.checkBody('amount', 'Please Enter an Amount').notEmpty();
	var errors = req.validationErrors();
	
	if(errors){
		res.render('members/loan', {errors:errors,id:id})
	}
	else{
			Group.groupName(groupid, function(err,group){
					data.groupname = group.name
				Member.newRepayment(data, function(err,payment){
					if(err) throw err
				})
				res.redirect('/members/' + id + '/repayment/'+loanid)
			})
			
	}

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

 /*name = ui.item.value
         */
module.exports = router