var AccessToken = require('../models/access.token');
var User = require('../models/user');
var mongoose = require('mongoose');

var ejs = require('ejs');
var fs = require('fs');
var pdf = require('html-pdf');
var os = require("os");	
var uuid = require('node-uuid');

// require model
var Forms = require('../models/forms');


exports.getFormByOffer = function(req,res){

	var accessToken = req.headers.authorization;
	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){

		if(err || tokenObj == null){
			callback(null);
		}else{

			var offerId = req.body.OfferId;
			console.log(offerId);

			Forms.find({ offer:offerId }, function(err, result){

				if(err){
					console.log(err);
				}else{
					res.send(result);
				}
			});
			

		}
	});

}

exports.generateOfferForms = function(req,res){

	var accessToken = req.headers.authorization;

	console.log('offer pdf file start here ... ');

	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){

		if(err || tokenObj == null){

			callback(null);
		}else{

			var contact = req.body.Contact;
			var offer = req.body.Offer;
			

			console.log(offer);

			var user = tokenObj.user;
		

			var html = fs.readFileSync('./views/pdf/sample.html', 'utf8');

			var renderHtml = ejs.render(html, { User: contact, Offer: offer });
		
			var options = { 
				format: 'Letter',
				"orientation": "portrait",
				"border": {
				    "top": "7mm",            // default is 0, units: mm, cm, in, px 
				    "right": "10mm",
				    "bottom": "7mm",
				    "left": "10mm"
				},
			};
		 

		 	var filename =  'offer_' + uuid.v4() + '.pdf';
		 	var path = './public/temp/forms/' + filename;

			pdf.create(renderHtml, options).toFile(path, function(err, result) {

			  if (err) return console.log(err);

			  // console.log(result);
			  // console.log(req.headers);
			  // console.log(req.headers.host);

			  var pdf_link = 'http://'+ req.headers.host + '/temp/forms/' + filename;

			  console.log(pdf_link);



			  // create form record
			  var newForm = new Forms();
			  newForm.path = pdf_link;
			  newForm.offer = offer._id;
			  newForm.type = 'Offer';
			  newForm.created = new Date();
			  
			  newForm.save(function(err,result){
				  res.json ({
				  	link: pdf_link
				  });	  	
			  });

			});

		}
	});



}


exports.generateListingForms = function(req,res){

	var accessToken = req.headers.authorization;

	// AccessToken.findOne({_id:token}).populate('user').exec(function(err,tokenObj){
	// 	if(err || tokenObj == null){
	// 		callback(null);
	// 	}else{
	// 		User.findOne({ _id: tokenObj.user._id}, function(err, currentUser){

	// 			if(!currentUser){
	// 				callback(null);
	// 			}else{
	// 				callback(currentUser);
	// 			}

	// 		});
	// 	}
	// });

	var html = fs.readFileSync('./views/pdf/listing.html', 'utf8');
	console.log(html);
	var options = { 
		format: 'Letter',
		"orientation": "portrait",
		"border": {
		    "top": "7mm",            // default is 0, units: mm, cm, in, px 
		    "right": "10mm",
		    "bottom": "7mm",
		    "left": "10mm"
		},
	};
 

 	var filename = 'lising_' + uuid.v4() + '.pdf';
 	var path = './public/temp/forms/' + filename;

	pdf.create(html, options).toFile(path, function(err, result) {

	  if (err) return console.log(err);

	  console.log(result); // { filename: '/app/businesscard.pdf' } 
	  console.log(req.headers);
	  console.log(req.headers.host);
	  res.json ({
	  	link: 'http://'+ req.headers.host + '/temp/forms/' + filename
	  });

	});


}







exports.getUserByToken = function(token, callback){
	AccessToken.findOne({_id:token}).populate('user').exec(function(err,tokenObj){
		if(err || tokenObj == null){
			callback(null);
		}else{
			User.findOne({ _id: tokenObj.user._id}, function(err, currentUser){

				if(!currentUser){
					callback(null);
				}else{
					callback(currentUser);
				}

			});
		}
	});
}

