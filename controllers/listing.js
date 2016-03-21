//var mongoose = require('mongoose');

// require models
var AccessToken = require('../models/access.token');
var User = require('../models/user');
var Listing = require('../models/listing');




exports.create = function(req,res){

	var accessToken = req.headers.authorization;
	console.log(accessToken);

	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
		
		if(err || tokenObj == null){
			res.send('err');
		}else{

			var user = tokenObj.user;

			var newListing = new Listing(req.body);
			newListing.agent = tokenObj.user._id;
			newListing.contact = req.body.contactId;
			console.log(newListing);


			newListing.save(function(err ,result){
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
	console.log('-------------- listing update ---------------');
	console.log(req.body);
	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
		if(err || tokenObj == null){
			res.send('err');
		}else{
			var user = tokenObj.user;
			Listing.findOneAndUpdate({_id:req.body._id, agent: user._id}, req.body, function(err ,doc){
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


	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
		
		if(err || tokenObj == null){
			res.send('err');
		}else{

			var user = tokenObj.user;

			Listing.find({agent: user._id, contact: req.body.contactId}, function(err, result){
				
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
