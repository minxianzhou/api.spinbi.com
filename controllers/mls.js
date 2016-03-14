var AccessToken = require('../models/access.token');
var User = require('../models/user');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var http = require('http');
var request = require('request');



exports.getSingleProperty= function(MlsNumber, callback){


	request({
	    url: 'https://www.realtor.ca/api/Listing.svc/PropertySearch_Post', //URL to hit
	    form: {
	    		ReferenceNumber: MlsNumber, 
	    		CultureId: 1,
	    		ApplicationId: 1
	    },
	    method: 'POST',
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
	    },
	}, function(error, response, body){
	    if(error) {
	        callback(error);
	    } else {
	        //console.log(response.statusCode, body);
	        callback(null, body);
	    }
	});

}


exports.generateOfferForms = function(req,res){

	var accessToken = req.headers.authorization;


	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
					console.log(err);
			console.log(tokenObj);
		if(err || tokenObj == null){

			callback(null);
		}else{

			var contact = req.body.Contact;
			
			var user = tokenObj.user;
			console.log(user);

			var html = fs.readFileSync('./views/pdf/sample.html', 'utf8');
			var renderHtml = ejs.render(html, { User: contact });
		
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

			  console.log(result);
			  console.log(req.headers);
			  console.log(req.headers.host);
			  res.json ({
			  	link: 'http://'+ req.headers.host + '/temp/forms/' + filename
			  });

			});

		}
	});



}
