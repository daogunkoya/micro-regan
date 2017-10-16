var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var now = new Date();
var dateNow = dateFormat(now,'isoDateTime');
dateOnly = dateFormat(now,'isoDate');
var Member = require('../models/member');
var Group = require('../models/group');
var Helper = require('../helper/formathelper');


module.exports.numberList = function(data){
	for(i=0;i<data.length;i++){
		data[i].no = i + 1
	}
	return data
}
module.exports.selectDate = function(option,dateFrom,dateTo){
	if(option =='date'){
		dateFrom = dateFrom
		dateTo = dateTo
	}
	else{
		if(option =='today'){
			dateFrom = dateOnly
			dateTo = dateOnly
		}
//search by 1week
			else{
				if(option =='1week'){
					weekDateFrom = dateFormat(new Date().setDate(now.getDate() - 7),'isoDate')
					dateFrom = weekDateFrom
					dateTo = dateOnly
					console.log('dateTo for 1week='+dateFrom)
				}
		//search by month
				else{
						if(option =='amonth'){
						monthDateFrom = dateFormat(new Date().setDate(now.getDate() - 30),'isoDate')
						dateFrom = monthDateFrom 
						dateTo = dateOnly
					}

					else{
						dateFrom =	 dateFormat(now.setDate(new Date().getDate() - 1),'isoDate')
						dateTo = 	dateFrom
						console.log('dateTo frm & to='+dateFrom + dateTo)
					}
					
				}
			}
	}
		return {dateFrom:dateFrom, dateTo:dateTo}
}

//two array of json objects users and accounts / (accounts merge to each users)
module.exports.accounts = function(users, accounts){
	 for(k=0; k<users.length; k++){  
                            for(i=0; i<accounts.length; i++){
                                        console.log('officer_id='+users[k]._id + ' accounts id='+ accounts[i]._id)
                                if(users[k]._id == accounts[i]._id){
                                            console.log('id equals')
                                users[k].totalBalance = parseFloat(accounts[i].totalBalance)
                                users[k].totalLoan = parseFloat(accounts[i].totalLoan)
                                users[k].totalRepayment =  parseFloat(accounts[i].totalRepayment)
                                                
                                        }
                                 }
                                 
                             console.log('object array = ' + users)
                            }
                       users = Helper.numberList(users)
               return users
}