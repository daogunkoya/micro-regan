var mongojs = require('mongojs')
//var mongoose = require('mongoose')
var db = mongojs('mongodb://danielbillion:regan@ds135029.mlab.com:35029/regan',['users','members','savings','withdrawals','creditofficers','loans','groups','repayments','guarantors','statements','expenses','payments'])

	Member = require('../models/member')
var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime')

//count  memeber
	module.exports.countMember = function(callback){
	db.members.count(callback)
}
//count  memeber credit officer
	module.exports.countCreditOfficer = function(callback){
	db.members.find({type:'Officer'}).count(callback)
}

//count credit officer members
	module.exports.countCreditOfficerMember = function(id,callback){
	db.members.find({creditofficerid:id}).count(callback)
}
// officer total member,groups
module.exports.officerAccountInfo = function(id,callback){
		info = []
	db.members.find({creditofficerid:id}).count(callback)
}

//find a memeber
	module.exports.member = function(id, callback){
	db.members.findOne({_id:mongojs.ObjectId(id)},callback)
}
//find a memeber
	module.exports.searchMember = function(name, callback){
	db.members.find({$or:[
		{fname:{$regex: name, '$options' : 'i'}},
		{lname:{$regex: name, '$options' : 'i'}}
		]},callback)
}
//delete member
module.exports.deleteMember = function(id,callback){
		db.members.remove({_id:mongojs.ObjectId(id)}, callback)
		db.users.remove({_id:mongojs.ObjectId(id)}, callback)
}

//find show  memeber
	module.exports.searchAMember = function(fname,lname, callback){
	db.members.find({$and:[
		{fname:fname},
		{lname:lname}
		]},callback)
}	

// find list of members
module.exports.membersList = function(callback){
	db.members.find(callback)
}

// officer members 
module.exports.officerMembers = function(id2,callback){
	console.log("from model id= " + id2)
	db.members.find({creditofficerid:id2}, callback)
}

// find list of Group members
module.exports.membersGroupList = function(id,callback){
	db.members.find({groupid:id},callback)
}

//find credit Officer
module.exports.findCreditOfficer = function(callback){
	db.members.find({type:'Officer'}, callback)
}
//find member by Username
module.exports.getMemberByUsername = function(username,callback){
		db.members.findOne({username:username}, callback)
}
//Update Member
module.exports.update = function(username,data, callback){
//find group id
	db.groups.findOne({name:data.group}, function(err,groupId){
			//data.groupid = mongojs.ObjectId(groupId._id)
	//find creditofficer_id
		db.members.findOne({username:data.creditofficer}, function(err,officer){
				
			//data.officerId = mongojs.ObjectId(officer._id)
		//update data info
			db.members.findAndModify({
				query:{username:username},
				update:{$set: data},
				new:true,
			}, callback)
			})
	})	
		

	db.users.findAndModify({
		query:{username:username},
		update:{$set: {email:data.email,fname:data.fname,lname:data.lname, type:data.type}},
		new:true,
	}, callback)
}

//member Deposite new Saving
module.exports.newSaving = function(data){
	db.savings.save(data)
}
//member show saving
module.exports.getMemberSaving = function(id,callback){
	db.savings.find({member_id:id}, callback)
}
//officer members show saving
module.exports.getOfficerMemberSaving = function(id,callback){
	db.savings.find({creditofficerid:id}, callback)
}
//update new saving to members saving balance
module.exports.updateMemberBalance= function(id,balance, callback){
	db.members.findAndModify({
		query:{_id:mongojs.ObjectId(id)},
		update:{$set:{balance:balance}},
		new:true
	}, callback)
}

//last  savinginsert
module.exports.lastSavingInsert = function(id,callback){
	db.savings.find({member_id:id}).sort({_id:-1}).limit(1,callback )
}

//last Withdrawal
module.exports.lastWithdrawal = function(id,callback){
	db.withdrawals.find({member_id:id}).sort({_id:-1}).limit(1,callback )
}
//member Withdrawal
module.exports.newWithdrawal = function(data){
	db.withdrawals.save(data)
}

//member show Withdrawal
module.exports.getMemberWithdrawal = function(id,callback){
	db.withdrawals.find({member_id:id}, callback)
}
//officers member show Withdrawal
module.exports.getOfficerMemberWithdrawal = function(id,callback){
	db.withdrawals.find({creditofficerid:id}, callback)
}

module.exports.updatedWithdrwalToSaving =function(id,balance,callback){
//find last inserted id for savings
		db.savings.find({member_id:id}).sort({_id:-1}).limit(1,function(err,data){
				for(i=0; i<data.length;i++){
					var last_id = data[i]._id
					console.log('main data' + data)
					console.log('last inserted id='+ last_id)
				}
//updated last inserted id into savings tble
				db.savings.findAndModify({
				query:{_id:mongojs.ObjectId(last_id)},
				update:{$set:{balance:balance}},
				new:true
				}, callback)

//update members balance
			db.members.findAndModify({
				query:{_id:mongojs.ObjectId(id)},
				update:{$set:{balance:balance}},
				new:true
			}, callback)

		} )	
			
}


//statement,check transaction
module.exports.checkTransaction = function(data,callback){
	db.statements.find({$and:
		[{member_id:data.member_id},{date:data.date}]
		}).sort({_id:-1}).limit(1,callback)
}
//Loans
module.exports.getMemberLoans = function(id, callback){
	db.loans.find({member_id:id}, callback)
}
//Officer member Loans
module.exports.getOfficerMemberLoans = function(id, callback){
	db.loans.find({creditofficerid:id}, callback)
}


//new loan request
module.exports.newLoan = function(data,callback){
		db.loans.save(data)
		db.members.findAndModify({
			query:{_id:mongojs.ObjectId(data.member_id)},
			update:{$set:{loan:data.amount,sc:data.charges,interest:data.interest,totalloan:data.totalrepayment,repayment:0}},
			new:true
		
		},callback)
	}


//delete loan
module.exports.loanDelete = function(id,callback){
	db.loans.remove({_id:mongojs.ObjectId(id)},callback)
}
//confirm loan
module.exports.confirmLoan = function(id,value, callback){
	value = value=="Pending"?"Active":"Pending"
	db.loans.findAndModify({
		query:{_id:mongojs.ObjectId(id)},
		update:{$set:{status:value, updated_at:dateNow}},
		new:true
	}, callback)
}

//Loan repayment
module.exports.getMemberRepayment = function(loanid,callback){	
	db.repayments.find({loanid:loanid}, callback)
}
// repayment Only
module.exports.Repayments = function(callback){	
	db.repayments.find(callback)
}
//save new repayment
module.exports.newRepayment = function(data,callback){
	db.repayments.save(data)			//add new repayment
	db.members.findAndModify({			//update member repayment field
		query:{_id:mongojs.ObjectId(data.member_id)},
		update:{$set:{repayment:data.repayment}},
		new:true
	}
//update balance on loan table
	,function(err,updateresult){
		if(err) throw err
		db.loans.findAndModify({			//update member repayment field
		query:{_id:mongojs.ObjectId(data.loanid)},
		update:{$set:{balance:data.balance}},
		new:true
	},callback)
	})
console.log('new repaymen model......')
	db.loans.findAndModify({			//update loan repayment
		query:{_id:mongojs.ObjectId(data.loanid)},
		update:{$set:{repayment:data.repayment}},
		new:true
	},callback)
console.log('data for repay' + data.repayment)
	if(parseFloat(data.repayment ) >= parseFloat(data.totalrepayment )){ //data.balance represent balanceToPay & totalrepayment is total amount owing
			console.log('balance is through:data.totalrepayment='+ data.totalrepayment + ' data.repayment='+data.balance )
			Member.finishRepayment({memberid:data.member_id,loanid:data.loanid,loan:0,status:'completed'},callback)
	}
}


//delete repayment
module.exports.deleteRepayment = function(data,callback){
		db.repayments.remove({_id:mongojs.ObjectId(data.id)}, callback)
}
//confirm repayment
module.exports.confirmRepayment= function(data,callback){
	db.repayments.findAndModify({
		query:{_id:mongojs.ObjectId(data.id)},
		update:{$set:{status:'Confirmed', updated_at:data.updated_at}},
		new:true
	},callback)
}
// Finished /complete repayment
module.exports.finishRepayment= function(data,callback){
//update loan stage completed or onGoing
	db.loans.findAndModify({
		query:{_id:mongojs.ObjectId(data.loanid)},
		update:{$set:{stage:data.status,displayrepayment:false, updated_at:data.updated_at}},
		new:true
	},callback)
	//update loan Repayments
	db.repayments.findAndModify({
		query:{loanid:data.loanid},
		update:{$set:{stage:data.status, updated_at:data.updated_at}},
		new:true
	},callback)
///update members current loan
	db.members.findAndModify({
		query:{_id:mongojs.ObjectId(data.memberid)},
		update:{$set:{loan:0,sc:0,interest:0,repayment:0,totalloan:0, updated_at:data.updated_at}},
		new:true
	},callback)
}

//account for credit officer/by officerid
module.exports.officerSaving = function(id,callback){
			db.members.aggregate([ 
			{
				$match:
					{creditofficerid:id}
			},
			
			{
				$group: { 
					_id:null, 
					totalBalance: { 
						$sum: "$balance" 
					} ,
					totalLoan:{
						$sum:"$totalloan"
					},
					totalRepayment:{
						$sum:"$repayment"
					}
				} 
			} 
		] , callback)

}
//group account on credit officer(s)
module.exports.officerAccount = function(callback){
			db.members.aggregate(
			
			
			{
				$group: { 
					_id:'$creditofficerid', 
					
					totalBalance: { 
						$sum: "$balance" 
					} ,
					totalLoan:{
						$sum:"$totalloan"
					},
					totalRepayment:{
						$sum:"$repayment"
					}
				} 
			} 
		, callback)

}
//account for All
module.exports.accounts = function(callback){
			db.members.aggregate( 
			{
				$group: { 
					_id:null, 
					totalBalance: { 
						$sum: "$balance" 
					} ,
					totalLoan:{
						$sum:"$totalloan"
					},
					totalRepayment:{
						$sum:"$repayment"
					}
				} 
			} 
		 , callback)

}

//total on Group
module.exports.groupAccounts = function(callback){
			db.members.aggregate( 
			{
				$group: { 
					_id:'$groupid', 
					totalBalance: { 
						$sum: "$balance" 
					} ,
					totalLoan:{
						$sum:"$totalloan"
					},
					totalRepayment:{
						$sum:"$repayment"
					}
				} 
			} 
		 , callback)

}
//expense
module.exports.expense = function(data){
	db.expenses.save(data)
}
//expense
module.exports.listExpenses = function(callback){
	db.expenses.find(callback)
}
//expense
module.exports.listExpensesByOfficer = function(id,callback){
	db.expenses.find({officerid:id},callback)
}

//Delete expense
module.exports.deleteExpense = function(id,callback){
db.expenses.remove({_id:mongojs.ObjectId(id)}, callback)
}

//Last payment balance
module.exports.lastPaymentByOfficer = function(id,callback){
	db.payments.find({officer_id:id}).sort({_id:-1}).limit(1,callback )
}
//List out Paymet by Officer
module.exports.listPaymentByOfficer = function(id,callback){
	db.payments.find({officer_id:id},callback)
}

//Payments  List
module.exports.listPayment = function(callback){
	db.payments.find(callback)
}

//save Paymet by Officer
module.exports.officerAddPayment = function(data,callback){
	db.payments.save(data)
}