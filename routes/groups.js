var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime');
//Group model 
var Group = require('../models/group')
var Member = require('../models/member')

//check if user is logged in
router.get('*', function(req,res,next){
	if(req.user == null){
		res.redirect('/users/login')
	}
	next();
})


//list groups & group account
router.get('/', function(req,res,next){
	console.log(req.user)
	groupAccount = []	
	id = req.user._id																																																																																																						
	console.log('id='+id)
		Member.member(id,function(err, member){					//find members details
			console.log("officer="+member)
			Group.groupAccounts(function(err,accounts){	//show account general
				if(err) throw err
				console.log('group account'+ accounts)
					Group.listGroups(function(err, groups){	//list groups 
						for(i=0;i<accounts.length;i++){						//loops through account result groupid & match groupid
							for(j=0;j<groups.length;j++){
								if(accounts[i]._id ==groups[j]._id){
									console.log('there is match')
									groupAccount.push({
										_id:accounts[i]._id,
										name:groups[j].name,
										leader:groups[j].leader,
										location:groups[j].location,
										name:groups[j].name,
										officer:groups[j].officerid,
										officer:groups[j].officer,
										totalBalance:accounts[i].totalBalance,
										totalLoan:accounts[i].totalLoan,
										totalRepayment:accounts[i].totalRepayment,
									})
								}

							}
						}
						console.log('groupAcount='+groupAccount)
							if(err) throw err
							res.render('groups/', {member:member,groups:groupAccount})
				})
			})
		})
	
})


//list officer groups
router.get('/officer/:id', function(req,res,next){
	console.log(req.user)
	groupAccount = []	
	id = req.params.id
		Member.member(id,function(err, member){					//find members details
			console.log("officer="+member)
			Group.officerGroupAccount(id, function(err,accounts){	//show account based on officer group
				if(err) throw err
				console.log('group account'+ accounts)
					Group.listGroupsByOfficer(id,function(err, groups){	//list groups of officer
					for(j=0;j<groups.length;j++){
						for(i=0;i<accounts.length;i++){						//loops through account result groupid & match groupid
							
								if(accounts[i]._id == groups[j]._id){
									console.log('there is match')
								groups[j].totalBalance = accounts[i].totalBalance
								groups[j].totalLoan = accounts[i].totalLoan
								groups[j].totalRepayment = accounts[i].totalRepayment
								}

							}
						}
						console.log('groupAcount='+groupAccount)
							if(err) throw err
							res.render('groups/', {member:member,groups:groups})
				})
			})
		})
	
})
//Add new groupid
router.post('/register', function(req,res,next){
		var name = req.body.name
		var officer = req.body.officer
		var id = req.body.id
		data = {
			name: name,
			leader: req.body.leader,
			location: req.body.location,
			officer:officer,
			officerid:id

		}
		console.log("officer,id"+officer+id)
		req.checkBody('name', 'Group Name Need To be Filled').notEmpty()

	//validation	
		var errors = req.validationErrors();
		
		if(errors){
			res.render('/groups/officer/'+id, {errors:errors})
		}


	//submit
		else{
			console.log(data)
			Group.register(data)
			res.redirect('/groups/officer/'+id)
		}
		
})

//List exisitng Group members
router.get('/:id/members', function(req,res,next){
	groupid = req.params.id
		
			Member.membersGroupList(groupid,function(err,members){
				if(err) throw err
				console.log('members in group'+ members)
				console.log('group id='+ groupid)
				Group.singleGroupAccount(groupid, function(err,accounts){
						console.log('result'+ accounts)
						res.render('officers/memberslist', {members:members,accounts:accounts[0]})
					})
				})
	
	
	

})


router.delete('/register', function(req,res,next){
	name = req.body.name
//validation
	req.checkBody('name', 'Please Fill in name').notEmpty();
  var data = {
			  	name: name
			  }
	errors = req.validationErrors()

	if(errors){
		res.render('/groups/register',{errors:errors})
	}
//post data
	else{
		Group.register(data)
		req.flash('success_msg', 'Group now saved')
		res.redirect('/members')
	}


})
//delete group
router.delete('/deletegroup/:id', function(req,res,next){
	var id= req.body.id
	console.log('id =', id)
	Group.delete(id, function(err,callback){
		if (err) throw err
			res.json({status:200})
	});
	
})

//Edit members info
router.get('/member/:id/edit', function(req,res,next){
//member unique id	
	var id = req.params.id
	Member.member(id,function(err, member){
		if(err) throw err
		Group.listGroups(function(err, groups){
			if(err) throw err
		creditofficer = Member.findCreditOfficer(function(err,creditofficer){
				data = {
			id:id,
			member:member,
			group:groups,
			creditofficer:creditofficer
			}
		res.render('groups/edit',{data:data})


		})
		
		})
	})
	

})
//Group Member Edit POST
router.post('/member/edit', function(req,res,next){

		title = req.body.title;
		fname = req.body.fname;
		lname = req.body.lname;
		email = req.body.email;
		address = req.body.address;
		phone = req.body.phone;
		group = req.body.group;
		type = req.body.type;
		creditofficer = req.body.creditofficer;
		id = req.body.id
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
		console.log("data="+data+ "id="+id)
		Group.update(id,data,function(err, data){
			if(err) throw err	
		})

		res.redirect('/members/list')
})

module.exports = router