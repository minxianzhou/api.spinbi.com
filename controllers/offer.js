//var mongoose = require('mongoose');

// require models
var AccessToken = require('../models/access.token');
var User = require('../models/user');
var Offer = require('../models/offer');


// require libs

// var ejs = require('ejs');
// var fs = require('fs');
// var pdf = require('html-pdf');
// var os = require("os");	
// var uuid = require('node-uuid');




exports.create = function(req,res){

	var accessToken = req.headers.authorization;
	console.log(accessToken);

	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
		
		if(err || tokenObj == null){
			res.send('err');
		}else{

			var user = tokenObj.user;

			var newOffer = new Offer(req.body);
			newOffer.agent = tokenObj.user._id;
			newOffer.contact = req.body.contactId;
			console.log(newOffer);


			newOffer.save(function(err ,result){
				if(err){
					console.log(err);
					res.status(500).send(err);
				}else{
					res.send(result);
				}
			});

	
			//res.send(newOffer);
		}
	});
}

exports.update = function(req,res){

	var accessToken = req.headers.authorization;
	console.log(accessToken);
	console.log(req.body);
	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
		if(err || tokenObj == null){
			res.send('err');
		}else{
			var user = tokenObj.user;
			Offer.findOneAndUpdate({_id:req.body._id, agent: user._id}, req.body, function(err ,doc){
				if(err){
					console.log(err);
					res.status(500).send(err);
				}else{
					res.send(doc);
				}
			});
		}
	});
}


exports.getAllForAgent = function(req,res){

	var accessToken = req.headers.authorization;
	console.log(accessToken);

	console.log('hello....');


	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
		
		if(err || tokenObj == null){
			res.send('err');
		}else{

			var user = tokenObj.user;

			Offer.find({agent: user._id, contact: req.body.contactId}, function(err, result){
				
				if(err){
					console.log(err);
					res.status(500).send(err);
				}else{
					console.log(result);
					res.send(result);
				}

			});

			
		}
	});
}
