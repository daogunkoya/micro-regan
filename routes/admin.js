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



//officer members
router.get('/memberslist', function(req,res,next){
	id2 = req.params.id
	mymembers= []
	console.log('officerid='+id2)
	if(req.user.type !== null){
			Member.membersList(function(err,members){
				Member.accounts(function(err, accounts){
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

//list credit officers
router.get('/creditofficers', function(req,res,next){
//find officers
        Member.findCreditOfficer(function(err,officers){
                        officersinfo = []
                        console.log('officers='+officers)
//find officers account
                        Member.officerAccount(function(err,accounts){
                             console.log('accounts='+accounts)
//check where id officer match officer account info
                            for(i=0; i<accounts.length; i++){
                                 for(k=0; k<officers.length; k++){  
                                        console.log('officer_id='+officers[k]._id + ' accounts id='+ accounts[i]._id)
                                        if(officers[k]._id == accounts[i]._id){
                                            console.log('id equals')
                                                officersinfo.push({
                                                id:officers[k]._id,
                                                fname:officers[k].fname,
                                                lname:officers[k].lname,
                                                username:officers[k].username,
                                                totalBalance: parseFloat(accounts[i].totalBalance),
                                                totalLoan: parseFloat(accounts[i].totalLoan),
                                                totalRepayment: parseFloat(accounts[i].totalRepayment),
                                                })
                                        }
                                 }
                                 
                             console.log('object array = ' + officersinfo)
                            }
        //total account for display
                            Member.accounts(function(err,total){
                                     console.log('total='+total + 'total balance' + total[0].totalBalance )
                                officersinfo = Statement.numberList(officersinfo)
                             res.render('admin/officers',{officers:officersinfo, account:total[0]})  
                            })
                         })
                           
        })
       
})

//Repayment
router.get('/repayments', function(req,res,next){
//find members
        Member.membersList(function(err,members){
                        membersinfo = []
                        console.log('members='+members)
//find members repayment
                        Member.Repayments(function(err,repayments){
                             console.log('accounts='+accounts)
//check where id officer match officer account info
                            for(i=0; i<repayments.length; i++){
                                 for(k=0; k<members.length; k++){  
                                        console.log('member_id='+members[k]._id + ' repayments id='+ repayments[i].member_id)
                                        if(officers[k]._id == accounts[i]._id){
                                            console.log('id equals')
                                                officersinfo.push({
                                                id:officers[k]._id,
                                                fname:officers[k].fname,
                                                lname:officers[k].lname,
                                                username:officers[k].username,
                                                totalBalance: parseFloat(accounts[i].totalBalance),
                                                totalLoan: parseFloat(accounts[i].totalLoan),
                                                totalRepayment: parseFloat(accounts[i].totalRepayment),
                                                })
                                        }
                                 }
                                 
                             console.log('object array = ' + officersinfo)
                            }
        //total account for display
                            Member.accounts(function(err,total){
                                     console.log('total='+total + 'total balance' + total[0].totalBalance )
                                
                             res.render('admin/officers',{officers:officersinfo, account:total[0]})  
                            })
                         })
                           
        })
       
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
router.get('/expenses', function(req,res,next){
		id =req.user._id
		console.log('id='+id)
	Member.listExpenses(function(err,expenses){
        expenses = Statement.numberList(expenses)
		Member.member(id, function(err, member){
			console.log('expenses ='+ expenses)
			res.render('officers/expenses',{expenses:expenses,member:member})
		})
	})
		
})

router.delete('/deletexpense', function(req,res,next){
        id = req.body.id
        console.log('deleting expense...' + id)
        Member.deleteExpense(id,function(err,info){
                res.json({status:200})
        })
})

//officer payment to admin
router.get('/payments', function(req,res,next){
        id =req.user._id
        console.log('id='+id)
    Member.listPayment(function(err,payments){
            payments = Statement.numberList(payments)
            Member.member(id, function(err, member){
                Member.accounts(function(err, accounts){
                        if(err) throw err
                        console.log('payments ='+ payments)
                            console.log(accounts[0])
                        res.render('admin/mypayments',{payments:payments,member:member,
                            accounts:accounts[0]})
                    })
                })
    })
        
})



 /*name = ui.item.value
         */
module.exports = router