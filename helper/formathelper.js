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